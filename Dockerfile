ARG BUN_VERSION=1.0.29
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY --link bun.lockb package.json ./
RUN bun install --ci

COPY --link client/bun.lockb client/package.json ./client/
RUN cd client && bun install --ci

COPY --link . .

WORKDIR /app/client
RUN bun run build

RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete

FROM base

COPY --from=build /app /app

EXPOSE 3000

CMD [ "bun", "run", "dev" ]

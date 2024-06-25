import { type Context } from "hono";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { SignJWT, jwtVerify } from "jose";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export const encrypt = async ({
  payload,
  expires,
}: {
  payload: SessionPayload;
  expires: string;
}) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
};

export const decrypt = async (token: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    return null;
  }
};

export const getSession = async ({ c, key }: { c: Context; key: string }) => {
  const result = getCookie(c, key);

  return result;
};

export const createSession = async ({
  c,
  userId,
}: {
  c: Context;
  userId: number;
}) => {
  const accessToken = await encrypt({
    payload: {
      userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), //15m,
    },
    expires: "15m",
  });

  const refreshToken = await encrypt({
    payload: {
      userId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), //1hr,
    },
    expires: "1hr",
  });

  const cookieOptions = {
    httpOnly: true, //Can not be accessed in the frontend
    secure: true, //Access through https
    sameSite: "Lax", //To avoid cross-site forgry attacks
  } as const;

  setCookie(
    c,
    "accessToken",
    typeof accessToken === "string" ? accessToken : JSON.stringify(accessToken),
    {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 60 * 1000), //Must match access token
    }
  );

  setCookie(
    c,
    "refresh_token",
    typeof refreshToken === "string"
      ? refreshToken
      : JSON.stringify(refreshToken),
    {
      ...cookieOptions,
      expires: new Date(Date.now() + 60 * 60 * 1000), //Must match refresh token
    }
  );
};

export const updateAccessToken = async ({ c }: { c: Context }) => {
  const cookie = await getSession({ c, key: "refresh_token" });

  const refreshToken = await decrypt(cookie);

  if (!refreshToken?.userId) {
    return c.json({ error: "Token is invalid, You need to login" }, 403);
  }

  const user = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.id, Number(refreshToken.userId)))
    .then((res) => res[0]);

  if (!user) {
    return c.json({ error: "Unauthorised!" }, 401);
  }

  const accessToken = await encrypt({
    payload: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), //15m,
    },
    expires: "2m",
  });

  const cookieOptions = {
    httpOnly: true, //Can not be accessed in the frontend
    secure: true, //Access through https
    sameSite: "Lax", //To avoid cross-site forgry attacks
    expires: new Date(Date.now() + 15 * 60 * 1000), //Must match access token
  } as const;

  setCookie(
    c,
    "accessToken",
    typeof accessToken === "string" ? accessToken : JSON.stringify(accessToken),
    cookieOptions
  );
};

export const verifyToken = async ({ c, key }: { c: Context; key: string }) => {
  const cookie = await getSession({ c, key });

  const token = await decrypt(cookie);

  if (!token?.userId) {
    return c.json({ error: "Token is invalid, You need to login" }, 403);
  }

  return token;
};

export const removeSession = async ({
  c,
  key,
}: {
  c: Context;
  key: string;
}) => {
  deleteCookie(c, key);
};

export const destroySession = async ({ c }: { c: Context }) => {
  ["access_token", "user", "refresh_token"].forEach((key) => {
    deleteCookie(c, key);
  });
};

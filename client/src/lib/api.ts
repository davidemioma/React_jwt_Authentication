import { hc } from "hono/client";
import { type ApiRoutesType } from "@/server/app";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutesType>("/");

export const api = client.api;

export const authUserQueryOptions = queryOptions({
  queryKey: ["get-auth-user"],
  queryFn: async () => {
    const res = await api.user.$get();

    if (!res.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await res.json();

    return data.user;
  },
  staleTime: Infinity, //This means it will stay cached until a user revalidate this path, refreshes the page or login/logout.
});

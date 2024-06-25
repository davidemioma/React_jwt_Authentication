import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import { createMiddleware } from "hono/factory";
import { decrypt, getSession, updateAccessToken } from "./session";

type User = {
  id: number;
  name: string;
  image: string | null;
  email: string;
  role: "user" | "admin" | null;
  hashedPassword: string;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean | null;
};

type Env = {
  Variables: {
    user: User;
  };
};

export const verifyUser = createMiddleware<Env>(async (c, next) => {
  try {
    const accessCookie = await getSession({ c, key: "access_token" });

    const refreshCookie = await getSession({ c, key: "refresh_token" });

    const refreshToken = await decrypt(refreshCookie);

    if (!refreshToken?.userId) {
      return c.json({ error: "Unauthorized! You need to sign in." }, 401);
    }

    const accessToken = await decrypt(accessCookie);

    if (refreshToken?.userId && !accessToken?.userId) {
      updateAccessToken({ c });
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        image: users.image,
        email: users.email,
        role: users.role,
        hashedPassword: users.hashedPassword,
        emailVerified: users.emailVerified,
        isTwoFactorEnabled: users.isTwoFactorEnabled,
      })
      .from(users)
      .where(eq(users.id, Number(refreshToken.userId)))
      .then((res) => res[0]);

    c.set("user", user);

    await next();
  } catch (err) {
    console.error("Middleware error: verify user", err);

    return c.json({ error: "Unauthorized! You need to sign in." }, 401);
  }
});

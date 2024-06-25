import { db } from "../db";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { verifyUser } from "../lib/middleware";
import { zValidator } from "@hono/zod-validator";
import { sendEmailChangeEmail } from "../lib/mail";
import { SettingsSchema, VerifyTokenSchema } from "../../types";
import { emailChangeVerificationTokens, users } from "../db/schema";
import { generateEmailChangeVerificationToken } from "../lib/token";
import { getEmailChangeVerificationTokenByToken } from "../lib/util";

export const userRoute = new Hono()
  .get("/", verifyUser, async (c) => {
    return c.json({ user: c.var.user });
  })
  .patch(
    "new-email",
    verifyUser,
    zValidator("json", VerifyTokenSchema),
    async (c) => {
      const user = c.var.user;

      const { token } = await c.req.valid("json");

      const tokenExists = await getEmailChangeVerificationTokenByToken(token);

      if (!tokenExists || !tokenExists.expires) {
        return c.json({ error: "Token not found" }, 404);
      }

      //Check if token has expired
      const hasExpired = new Date(tokenExists.expires) < new Date();

      if (hasExpired) {
        return c.json({ error: "Token has expired" }, 401);
      }

      //check if user exists
      const userExists = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(
          and(eq(users.id, user.id), eq(users.email, tokenExists.oldEmail))
        )
        .then((res) => res[0]);

      if (!userExists) {
        return c.json({ error: "User not found" }, 404);
      }

      // Update user
      await db
        .update(users)
        .set({ email: tokenExists.newEmail, emailVerified: new Date() })
        .where(eq(users.id, user.id));

      // Delete token
      await db
        .delete(emailChangeVerificationTokens)
        .where(eq(emailChangeVerificationTokens.id, tokenExists.id));

      return c.json({ message: "Email has been changed" }, 200);
    }
  )
  .patch(
    "update-settings",
    verifyUser,
    zValidator("json", SettingsSchema),
    async (c) => {
      const user = c.var.user;

      const { name, email, password, newPassword, role, isTwoFactorEnabled } =
        await c.req.valid("json");

      //check if user exists
      const userExists = await db
        .select({
          id: users.id,
          hashedPassword: users.hashedPassword,
        })
        .from(users)
        .where(eq(users.id, user.id))
        .then((res) => res[0]);

      if (!user || !userExists) {
        return c.json(
          { error: "Unauthorized! Log in to update settings" },
          401
        );
      }

      // If credential users wants to change their email
      if (email && email !== user.email) {
        //Check if email belong to another account
        const emailExists = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.email, email))
          .then((res) => res[0]);

        if (emailExists && emailExists.id !== user.id) {
          return c.json({ error: "Email already in use" }, 409);
        }

        const verificationToken = await generateEmailChangeVerificationToken({
          oldEmail: user.email,
          newEmail: email,
        });

        await sendEmailChangeEmail({
          newEmail: email,
          token: verificationToken.token,
        });

        return c.json({ message: "Verification email sent!" }, 202);
      }

      // If credential users wants to change their password
      let hashedPassword = undefined;

      if (password && newPassword && userExists.hashedPassword) {
        const pwdMatch = await bcrypt.compare(
          password,
          userExists.hashedPassword
        );

        if (!pwdMatch) {
          return c.json({ error: "Wrong password!" }, 401);
        }

        //if password match encrypt new password
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      // Update user
      await db
        .update(users)
        .set({ name, email, hashedPassword, role, isTwoFactorEnabled })
        .where(eq(users.id, user.id));

      return c.json({ message: "Settings updated!" }, 200);
    }
  )
  .get("admin-only", verifyUser, async (c) => {
    const user = c.var.user;

    if (user.role !== "admin") {
      return c.json(
        {
          message:
            "Unauthorized! you don't have the permission to access this.",
        },
        401
      );
    }

    return c.json({ message: "Hello, Admin" }, 200);
  });

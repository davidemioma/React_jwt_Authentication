import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("userRole", ["admin", "user"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified"),
  hashedPassword: text("hashed_password").notNull(),
  role: userRole("userRole").default("user"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const emailChangeVerificationTokens = pgTable(
  "email_change_verification_tokens",
  {
    id: serial("id").primaryKey(),
    oldEmail: text("old_email").unique().notNull(),
    newEmail: text("new_email").unique().notNull(),
    token: text("token").unique().notNull(),
    expires: timestamp("expires"),
  }
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const twoFactorTokens = pgTable("two_factor_tokens", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires"),
});

export const twoFactorConfirmations = pgTable("two_factor_confirmations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

import { db } from "../db";
import { eq, and } from "drizzle-orm";
import {
  emailChangeVerificationTokens,
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from "../db/schema";

export const getVerificationTokenByEmail = async (email: string) => {
  const verficationToken = await db
    .select({
      id: verificationTokens.id,
    })
    .from(verificationTokens)
    .where(eq(verificationTokens.email, email))
    .then((res) => res[0]);

  return verficationToken;
};

export const getVerificationTokenByToken = async (token: string) => {
  const verficationToken = await db
    .select({
      id: verificationTokens.id,
      email: verificationTokens.email,
      expires: verificationTokens.expires,
    })
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .then((res) => res[0]);

  return verficationToken;
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  const twoFactorToken = await db
    .select({
      id: twoFactorTokens.id,
      expires: twoFactorTokens.expires,
      email: twoFactorTokens.email,
    })
    .from(twoFactorTokens)
    .where(eq(twoFactorTokens.email, email))
    .then((res) => res[0]);

  return twoFactorToken;
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  const passwordResetToken = await db
    .select({
      id: passwordResetTokens.id,
    })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.email, email))
    .then((res) => res[0]);

  return passwordResetToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
  const passwordResetToken = await db
    .select({
      id: passwordResetTokens.id,
      email: passwordResetTokens.email,
      expires: passwordResetTokens.expires,
    })
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .then((res) => res[0]);

  return passwordResetToken;
};

export const getEmailChangeVerificationTokenByEmail = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
  const verficationToken = await db
    .select({
      id: emailChangeVerificationTokens.id,
    })
    .from(emailChangeVerificationTokens)
    .where(
      and(
        eq(emailChangeVerificationTokens.oldEmail, oldEmail),
        eq(emailChangeVerificationTokens.newEmail, newEmail)
      )
    )
    .then((res) => res[0]);

  return verficationToken;
};

export const getEmailChangeVerificationTokenByToken = async (token: string) => {
  const verficationToken = await db
    .select({
      id: emailChangeVerificationTokens.id,
      oldEmail: emailChangeVerificationTokens.oldEmail,
      newEmail: emailChangeVerificationTokens.newEmail,
      expires: emailChangeVerificationTokens.expires,
    })
    .from(emailChangeVerificationTokens)
    .where(eq(emailChangeVerificationTokens.token, token))
    .then((res) => res[0]);

  return verficationToken;
};

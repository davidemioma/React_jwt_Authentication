import { db } from "../db";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import {
  emailChangeVerificationTokens,
  passwordResetTokens,
  twoFactorTokens,
  verificationTokens,
} from "../db/schema";
import {
  getEmailChangeVerificationTokenByEmail,
  getPasswordResetTokenByEmail,
  getTwoFactorTokenByEmail,
  getVerificationTokenByEmail,
} from "./util";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getVerificationTokenByEmail(email);

  //Delete existing token
  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  //Create a new token.
  const verficationToken = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning({
      id: verificationTokens.id,
      email: verificationTokens.email,
      token: verificationTokens.token,
    })
    .then((res) => res[0]);

  return verficationToken;
};

export const generateTwofactorToken = async (email: string) => {
  //Generate random 6 digits
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  //This is expiring in 5 min.
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getTwoFactorTokenByEmail(email);

  //Delete existing token
  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id));
  }

  //Create a new token.
  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({ email, token, expires })
    .returning({
      id: twoFactorTokens.id,
      email: twoFactorTokens.email,
      token: twoFactorTokens.token,
    })
    .then((res) => res[0]);

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getPasswordResetTokenByEmail(email);

  //Delete existing token
  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  //Create a new token.
  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({ email, token, expires })
    .returning({
      id: passwordResetTokens.id,
      email: passwordResetTokens.email,
      token: passwordResetTokens.token,
    })
    .then((res) => res[0]);

  return passwordResetToken;
};

export const generateEmailChangeVerificationToken = async ({
  oldEmail,
  newEmail,
}: {
  oldEmail: string;
  newEmail: string;
}) => {
  const token = uuidv4();

  //This is expiring in 10 mins.
  const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

  //Check if there is an existing verification token for this email.
  const existingToken = await getEmailChangeVerificationTokenByEmail({
    oldEmail,
    newEmail,
  });

  //Delete existing token
  if (existingToken) {
    await db
      .delete(emailChangeVerificationTokens)
      .where(eq(emailChangeVerificationTokens.id, existingToken.id));
  }

  //Create a new token.
  const verficationToken = await db
    .insert(emailChangeVerificationTokens)
    .values({ oldEmail, newEmail, token, expires })
    .returning({
      id: emailChangeVerificationTokens.id,
      oldEmail: emailChangeVerificationTokens.oldEmail,
      newEmail: emailChangeVerificationTokens.newEmail,
      token: emailChangeVerificationTokens.token,
    })
    .then((res) => res[0]);

  return verficationToken;
};

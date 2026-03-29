import { SignJWT, jwtVerify } from "jose";

import { env } from "@/lib/server/env";
import type { AuthTokenPayload } from "@/lib/server/types";

const encoder = new TextEncoder();

export const AUTH_COOKIE_NAME = "tam_auth";

function secret() {
  return encoder.encode(env.JWT_SECRET);
}

export type ResetPinTokenPayload = {
  familyId: string;
  ownerPhone: string;
  purpose: "reset-pin";
};

export type ReportDownloadTokenPayload = {
  familyId: string;
  reportId: string;
  purpose: "report-download";
};

async function signPurposeToken(payload: Record<string, unknown>, expiresIn: string) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function createAuthToken(payload: AuthTokenPayload) {
  return await signPurposeToken(payload as Record<string, unknown>, "30d");
}

export async function verifyAuthToken(token: string) {
  const verified = await jwtVerify<AuthTokenPayload>(token, secret());
  return verified.payload;
}

export async function createResetPinToken(payload: Omit<ResetPinTokenPayload, "purpose">, expiresIn = "15m") {
  return await signPurposeToken(
    {
      ...payload,
      purpose: "reset-pin",
    },
    expiresIn,
  );
}

export async function verifyResetPinToken(token: string) {
  const verified = await jwtVerify<ResetPinTokenPayload>(token, secret());
  if (verified.payload.purpose !== "reset-pin") {
    throw new Error("Invalid reset PIN token purpose");
  }
  return verified.payload;
}

export async function createReportDownloadToken(
  payload: Omit<ReportDownloadTokenPayload, "purpose">,
  expiresIn = "15m",
) {
  return await signPurposeToken(
    {
      ...payload,
      purpose: "report-download",
    },
    expiresIn,
  );
}

export async function verifyReportDownloadToken(token: string) {
  const verified = await jwtVerify<ReportDownloadTokenPayload>(token, secret());
  if (verified.payload.purpose !== "report-download") {
    throw new Error("Invalid report download token purpose");
  }
  return verified.payload;
}

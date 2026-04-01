import bcrypt from "bcryptjs";

import { COOKIE_MAX_AGE_SECONDS, RESET_PIN_TTL_SECONDS } from "@/lib/server/constants";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  createResetPinToken,
  verifyAuthToken,
  verifyResetPinToken,
} from "@/lib/server/auth/tokens";
import { parseCookieHeader, serializeCookie } from "@/lib/server/auth/cookies";
import { withSeededStore } from "@/lib/server/store";
import { env } from "@/lib/server/env";
import {
  generateId,
  toPublicChild,
  deriveAvatarSeed,
  parentIsFresh,
} from "@/lib/server/helpers";
import { nowIso } from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  ChildProfile,
  FamilyAccount,
} from "@/lib/server/types";

function authCookie(token: string) {
  return serializeCookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

async function issueToken(payload: AuthTokenPayload) {
  const token = await createAuthToken(payload);
  return {
    token,
    cookie: authCookie(token),
  };
}

async function deliverResetPinSms(ownerPhone: string, resetToken: string) {
  if (!env.RESEND_API_KEY) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [ownerPhone],
      subject: "탐 부모 PIN 재설정 링크",
      html:
        "<p>탐 부모 PIN 재설정 요청이 접수되었습니다.</p>" +
        `<p>앱에서 아래 토큰을 사용해 새 PIN을 설정하세요.</p><pre>${resetToken}</pre>` +
        "<p>이 토큰은 15분 동안만 유효합니다.</p>",
    }),
  });

  if (!response.ok) {
    throw new ApiError(502, "RESET_PIN_EMAIL_FAILED", await response.text());
  }

  return true;
}

export async function requireAuth(request: Request, options?: { requireParent?: boolean }) {
  const cookieMap = parseCookieHeader(request.headers.get("cookie"));
  const token = cookieMap.get(AUTH_COOKIE_NAME);
  if (!token) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication cookie is missing");
  }

  const payload = await verifyAuthToken(token);
  if (options?.requireParent && !parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  return payload;
}

export async function getFamilyContextFromPayload(payload: AuthTokenPayload) {
  const store = await withSeededStore();
  const family = await store.getFamily(payload.familyId);
  if (!family) {
    throw new ApiError(401, "INVALID_TOKEN", "Family was not found");
  }
  const activeChild = await store.getChild(payload.activeChildId);
  if (!activeChild || activeChild.familyId !== family.id) {
    throw new ApiError(401, "INVALID_TOKEN", "Active child was not found");
  }

  return {
    store,
    family,
    activeChild,
  };
}

export async function signupFamily(input: {
  ownerPhone: string;
  ownerName: string;
  password: string;
  parentPIN: string;
  firstChild: {
    name: string;
    age: number;
  };
}) {
  const store = await withSeededStore();
  const existingFamily = await store.findFamilyByPhone(input.ownerPhone);
  if (existingFamily) {
    throw new ApiError(409, "PHONE_ALREADY_EXISTS", "A family account already exists for this phone number");
  }

  const timestamp = nowIso();
  const familyId = generateId("family");
  const childId = generateId("child");
  const deviceId = generateId("device");

  const family: FamilyAccount = {
    id: familyId,
    ownerPhone: input.ownerPhone,
    ownerName: input.ownerName,
    passwordHash: await bcrypt.hash(input.password, 10),
    parentPinHash: await bcrypt.hash(input.parentPIN, 10),
    activeChildId: childId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const child: ChildProfile = {
    id: childId,
    familyId,
    name: input.firstChild.name,
    age: input.firstChild.age,
    avatarSeed: deriveAvatarSeed(input.firstChild.name),
    isDefault: true,
    onboardedAt: null,
    createdAt: timestamp,
  };

  await store.upsertFamily(family);
  await store.upsertChild(child);
  await store.upsertFamilyDevice({
    id: generateId("family-device"),
    familyId,
    deviceId,
    createdAt: timestamp,
    lastSeenAt: timestamp,
  });

  const auth = await issueToken({
    familyId,
    activeChildId: childId,
    deviceId,
    parentVerified: false,
  });

  return {
    familyId,
    activeChild: toPublicChild(child),
    children: [toPublicChild(child)],
    auth,
  };
}

export async function loginFamily(input: { phone: string; password: string }) {
  const store = await withSeededStore();
  const family = await store.findFamilyByPhone(input.phone);
  if (!family) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid phone number or password");
  }
  const isValid = await bcrypt.compare(input.password, family.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid phone number or password");
  }

  const childrenList = await store.listChildrenByFamily(family.id);
  const activeChild = childrenList.find((child) => child.id === family.activeChildId) ?? childrenList[0];
  if (!activeChild) {
    throw new ApiError(500, "NO_CHILD_PROFILE", "No child profile exists for the family account");
  }

  const timestamp = nowIso();
  const deviceId = generateId("device");
  await store.upsertFamilyDevice({
    id: generateId("family-device"),
    familyId: family.id,
    deviceId,
    createdAt: timestamp,
    lastSeenAt: timestamp,
  });

  const auth = await issueToken({
    familyId: family.id,
    activeChildId: activeChild.id,
    deviceId,
    parentVerified: false,
  });

  return {
    familyId: family.id,
    activeChildId: activeChild.id,
    children: childrenList.map(toPublicChild),
    auth,
  };
}

export async function verifyParentPin(payload: AuthTokenPayload, input: { pin: string }) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const isValid = await bcrypt.compare(input.pin, family.parentPinHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_PARENT_PIN", "Parent PIN is incorrect");
  }

  const PARENT_VERIFIED_TTL_SECONDS = 60 * 5;
  const auth = await issueToken({
    ...payload,
    parentVerified: true,
    parentVerifiedAt: nowIso(),
  });

  return {
    verified: true,
    expiresIn: PARENT_VERIFIED_TTL_SECONDS,
    auth,
    store,
  };
}

export async function requestParentPinReset(input: { ownerPhone: string }) {
  const store = await withSeededStore();
  const family = await store.findFamilyByPhone(input.ownerPhone);
  if (!family) {
    return {
      requested: true,
      expiresIn: RESET_PIN_TTL_SECONDS,
      delivery: env.NODE_ENV === "production" ? "sms" : "preview",
    };
  }

  const resetToken = await createResetPinToken({
    familyId: family.id,
    ownerPhone: family.ownerPhone,
  });
  const delivered = await deliverResetPinSms(family.ownerPhone, resetToken);

  return {
    requested: true,
    expiresIn: RESET_PIN_TTL_SECONDS,
    delivery: delivered ? "sms" : "preview",
    resetTokenPreview: delivered || env.NODE_ENV === "production" ? undefined : resetToken,
  };
}

export async function confirmParentPinReset(input: { resetToken: string; newPIN: string }) {
  let tokenPayload;
  try {
    tokenPayload = await verifyResetPinToken(input.resetToken);
  } catch (error) {
    throw new ApiError(
      401,
      "INVALID_RESET_PIN_TOKEN",
      error instanceof Error ? error.message : "Reset PIN token is invalid",
    );
  }

  const store = await withSeededStore();
  const family = await store.getFamily(tokenPayload.familyId);
  if (!family || family.ownerPhone !== tokenPayload.ownerPhone) {
    throw new ApiError(404, "FAMILY_NOT_FOUND", "Family account was not found");
  }

  await store.upsertFamily({
    ...family,
    parentPinHash: await bcrypt.hash(input.newPIN, 10),
    updatedAt: nowIso(),
  });

  return {
    updated: true,
  };
}

import bcrypt from "bcryptjs";

import { getFamilyContextFromPayload } from "./auth";
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
} from "@/lib/server/types";
import {
  createAuthToken,
} from "@/lib/server/auth/tokens";
import { serializeCookie } from "@/lib/server/auth/cookies";
import { AUTH_COOKIE_NAME } from "@/lib/server/auth/tokens";
import { env } from "@/lib/server/env";
import { COOKIE_MAX_AGE_SECONDS } from "@/lib/server/constants";

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

export async function getFamilyMe(payload: AuthTokenPayload) {
  const { store, family, activeChild } = await getFamilyContextFromPayload(payload);
  const childrenList = await store.listChildrenByFamily(family.id);

  return {
    familyId: family.id,
    ownerName: family.ownerName,
    ownerPhone: family.ownerPhone,
    activeChildId: family.activeChildId,
    activeChild: toPublicChild(activeChild),
    children: childrenList.map(toPublicChild),
    parentVerified: parentIsFresh(payload),
  };
}

export async function addChildProfile(payload: AuthTokenPayload, input: { name: string; age: number }) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const child: ChildProfile = {
    id: generateId("child"),
    familyId: family.id,
    name: input.name,
    age: input.age,
    avatarSeed: deriveAvatarSeed(input.name),
    isDefault: false,
    onboardedAt: null,
    createdAt: nowIso(),
  };
  await store.upsertChild(child);
  return { child: toPublicChild(child) };
}

export async function switchActiveChild(payload: AuthTokenPayload, input: { childId: string }) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(input.childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const updatedFamily = {
    ...family,
    activeChildId: child.id,
    updatedAt: nowIso(),
  };
  await store.upsertFamily(updatedFamily);
  const auth = await issueToken({
    ...payload,
    activeChildId: child.id,
  });

  return {
    activeChildId: child.id,
    name: child.name,
    auth,
  };
}

export async function updateParentPin(
  payload: AuthTokenPayload,
  input: { currentPIN: string; newPIN: string },
) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const isValid = await bcrypt.compare(input.currentPIN, family.parentPinHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_PARENT_PIN", "Current PIN is incorrect");
  }

  await store.upsertFamily({
    ...family,
    parentPinHash: await bcrypt.hash(input.newPIN, 10),
    updatedAt: nowIso(),
  });

  return { updated: true };
}

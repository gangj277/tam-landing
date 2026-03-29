import { beforeEach } from "vitest";

Object.assign(process.env, {
  NODE_ENV: "test",
  TAM_DATA_BACKEND: "memory",
  TAM_AI_MODE: "mock",
  JWT_SECRET: process.env.JWT_SECRET || "test-jwt-secret-for-vitest-only",
});

beforeEach(() => {
  delete (globalThis as { __tamMemoryState__?: unknown }).__tamMemoryState__;
});

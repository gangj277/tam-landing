import { env } from "@/lib/server/env";
import { createMemoryStore } from "./memory";
import { createPostgresStore } from "./postgres";
import type { Store } from "./types";

export type { Store } from "./types";

let cachedStore: Store | null = null;

export function getStore() {
  if (env.TAM_DATA_BACKEND === "memory") {
    return createMemoryStore();
  }

  if (!cachedStore) {
    cachedStore = createPostgresStore();
  }
  return cachedStore;
}

export async function withSeededStore() {
  const store = getStore();
  await store.ensureMissionsSeeded();
  return store;
}

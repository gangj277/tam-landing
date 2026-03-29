import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/server/env";
import * as schema from "@/lib/server/db/schema";

export function createDb() {
  const client = neon(env.DATABASE_URL!);
  return drizzle({ client, schema });
}

export type DbClient = ReturnType<typeof createDb>;

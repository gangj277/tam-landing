import { consultationRequests } from "@/lib/server/db/schema";
import { createDb } from "@/lib/server/db/client";
import { handleRoute } from "@/lib/server/route";
import { desc } from "drizzle-orm";

export async function GET() {
  return await handleRoute(async () => {
    const db = createDb();
    const rows = await db
      .select()
      .from(consultationRequests)
      .orderBy(desc(consultationRequests.createdAt));
    return { ok: true, data: rows };
  });
}

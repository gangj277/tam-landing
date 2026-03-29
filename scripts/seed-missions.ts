import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });
loadDotenv();

import { MISSIONS as sourceMissions } from "@/lib/dummy-data";
import { createDb } from "@/lib/server/db/client";
import { missions } from "@/lib/server/db/schema";

async function main() {
  const db = createDb();
  const createdAt = "2026-03-29T00:00:00.000Z";

  for (const mission of sourceMissions) {
    await db
      .insert(missions)
      .values({
        id: mission.id,
        category: mission.category,
        difficulty: mission.difficulty,
        isActive: true,
        payload: {
          ...mission,
          isActive: true,
          createdAt,
        },
        createdAt,
      })
      .onConflictDoUpdate({
        target: missions.id,
        set: {
          category: mission.category,
          difficulty: mission.difficulty,
          isActive: true,
          payload: {
            ...mission,
            isActive: true,
            createdAt,
          },
        },
      });
  }

  console.log(`Seeded ${sourceMissions.length} missions`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { generateSessionRound, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = await readJson<{ sessionId: string; roundIndex: number }>(request);
    return {
      round: await generateSessionRound(auth, body),
    };
  });
}

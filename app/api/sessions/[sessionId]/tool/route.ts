import { recordThinkingToolUsage, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { sessionId } = await context.params;
    const body = await readJson<{ roundIndex: number; toolType: "broaden" | "reframe" | "subvert" }>(request);
    return await recordThinkingToolUsage(auth, sessionId, body);
  });
}

import { requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    await requireAuth(request);
    const body = await readJson<{ deepDiveId: string }>(request);
    // Mock portfolio generation — will be replaced with AI in Phase 8
    return {
      deepDiveId: body.deepDiveId,
      portfolioSentence:
        "이 탐구를 통해 현실의 복잡한 문제에는 하나의 정답이 없다는 것을 알게 되었어요.",
    };
  });
}

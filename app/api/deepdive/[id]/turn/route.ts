import { recordDeepDiveTurnResponse, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { id } = await params;
    const body = await readJson<{
      turnIndex: number;
      selectedOptionId?: string;
      textResponse?: string;
    }>(request);
    return await recordDeepDiveTurnResponse(auth, id, body);
  });
}

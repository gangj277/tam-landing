import { recordDeepDiveStepResponse, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { id } = await context.params;
    const body = await readJson<{
      stepIndex: number;
      response?: string;
      selectedOptionId?: string;
    }>(request);
    return await recordDeepDiveStepResponse(auth, id, body);
  });
}

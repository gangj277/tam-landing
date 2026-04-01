import { completeDeepDive, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { id } = await context.params;
    const body = await readJson<{ portfolioEntry: string }>(request);
    return await completeDeepDive(auth, id, body);
  });
}

import { completeDeepDive, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { id } = await params;
    const { portfolioEntry } = await readJson<{ portfolioEntry: string }>(request);
    return await completeDeepDive(auth, id, { portfolioEntry });
  });
}

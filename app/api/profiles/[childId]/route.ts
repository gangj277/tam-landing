import { getProfileByChildId, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(
  request: Request,
  context: { params: Promise<{ childId: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { childId } = await context.params;
    return {
      profile: await getProfileByChildId(auth, childId),
    };
  });
}

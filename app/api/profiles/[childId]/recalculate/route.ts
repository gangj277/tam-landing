import { recalculateProfileByChildId, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function POST(
  request: Request,
  context: { params: Promise<{ childId: string }> },
) {
  return await handleRoute(async () => {
    await requireAuth(request);
    const { childId } = await context.params;
    return {
      profile: await recalculateProfileByChildId(childId),
      updated: true,
    };
  });
}

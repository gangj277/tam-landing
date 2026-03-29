import { listWeeklyReportsByChildId, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(
  request: Request,
  context: { params: Promise<{ childId: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request, { requireParent: true });
    const { childId } = await context.params;
    return {
      reports: await listWeeklyReportsByChildId(auth, childId),
    };
  });
}

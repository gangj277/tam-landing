import { getSessionDetail, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { sessionId } = await context.params;
    return await getSessionDetail(auth, sessionId);
  });
}

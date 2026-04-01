import { getDeepDiveDetail, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { id } = await params;
    return await getDeepDiveDetail(auth, id);
  });
}

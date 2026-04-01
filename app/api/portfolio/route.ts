import { getPortfolioByChild, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const url = new URL(request.url);
    const childId = url.searchParams.get("childId");
    if (!childId) {
      return Response.json(
        { error: { code: "MISSING_PARAM", message: "childId is required" } },
        { status: 400 },
      );
    }
    return await getPortfolioByChild(auth, childId);
  });
}

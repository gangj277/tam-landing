import { requireAuth, switchActiveChild } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function PATCH(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = await readJson<{ childId: string }>(request);
    const result = await switchActiveChild(auth, body);
    const response = Response.json({
      activeChildId: result.activeChildId,
      name: result.name,
    });
    response.headers.set("set-cookie", result.auth.cookie);
    return response;
  });
}

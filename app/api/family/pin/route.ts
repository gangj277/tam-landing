import { requireAuth, updateParentPin } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function PATCH(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request, { requireParent: true });
    const body = await readJson<{ currentPIN: string; newPIN: string }>(request);
    return await updateParentPin(auth, body);
  });
}

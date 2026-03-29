import { addChildProfile, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request, { requireParent: true });
    const body = await readJson<{ name: string; age: number }>(request);
    return await addChildProfile(auth, body);
  });
}

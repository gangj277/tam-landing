import {
  createDeepDiveSession,
  listDeepDivesByChild,
  requireAuth,
} from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function GET(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    return await listDeepDivesByChild(auth);
  });
}

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const { missionId } = await readJson<{ missionId: string }>(request);
    return await createDeepDiveSession(auth, { missionId });
  });
}

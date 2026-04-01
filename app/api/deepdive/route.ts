import {
  createDeepDiveSession,
  listDeepDivesByChild,
  requireAuth,
} from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = await readJson<{ missionId: string }>(request);
    const result = await createDeepDiveSession(auth, body);
    return Response.json(result, { status: result.reused ? 200 : 201 });
  });
}

export async function GET(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const url = new URL(request.url);
    const childId = url.searchParams.get("childId") ?? undefined;
    return await listDeepDivesByChild(auth, childId);
  });
}

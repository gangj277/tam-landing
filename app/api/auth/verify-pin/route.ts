import { requireAuth, verifyParentPin } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    const body = await readJson<{ pin: string }>(request);
    const result = await verifyParentPin(auth, body);
    const response = Response.json({
      verified: result.verified,
      expiresIn: result.expiresIn,
    });
    response.headers.set("set-cookie", result.auth.cookie);
    return response;
  });
}

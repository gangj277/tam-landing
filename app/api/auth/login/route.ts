import { loginFamily } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const body = await readJson<{ phone: string; password: string }>(request);
    const result = await loginFamily(body);
    const response = Response.json(result);
    response.headers.set("set-cookie", result.auth.cookie);
    return response;
  });
}

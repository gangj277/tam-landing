import { signupFamily } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const body = await readJson<{
      ownerPhone: string;
      ownerName: string;
      password: string;
      parentPIN: string;
      firstChild: { name: string; age: number };
    }>(request);
    const result = await signupFamily(body);
    const response = Response.json(
      {
        familyId: result.familyId,
        activeChild: result.activeChild,
        children: result.children,
      },
      { status: 201 },
    );
    response.headers.set("set-cookie", result.auth.cookie);
    return response;
  });
}

import { getTomorrowMission, requireAuth } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(request: Request) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request);
    return await getTomorrowMission(auth);
  });
}

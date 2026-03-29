import { listAllMissions } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET() {
  return await handleRoute(async () => ({
    missions: await listAllMissions(),
  }));
}

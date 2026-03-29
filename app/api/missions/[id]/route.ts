import { getMissionById } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return await handleRoute(async () => {
    const { id } = await context.params;
    return {
      mission: await getMissionById(id),
    };
  });
}

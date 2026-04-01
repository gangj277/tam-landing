import { streamDeepDiveTurn, requireAuth } from "@/lib/server/backend";
import { readJson } from "@/lib/server/utils/http";
import { errorResponse } from "@/lib/server/utils/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const { turnIndex } = await readJson<{ turnIndex: number }>(request);
    const stream = await streamDeepDiveTurn(auth, id, turnIndex);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

import { streamAgentResponse, requireAuth } from "@/lib/server/backend";
import { readJson, errorResponse } from "@/lib/server/utils/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const body = await readJson<{ message?: string | null }>(request);
    const childMessage = body.message ?? null;

    const stream = await streamAgentResponse(auth, id, childMessage);

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

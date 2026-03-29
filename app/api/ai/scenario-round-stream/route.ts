import { prepareSessionRoundStream, requireAuth } from "@/lib/server/backend";
import { ApiError, readJson } from "@/lib/server/utils/http";

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    const body = await readJson<{ sessionId: string; roundIndex: number }>(request);
    const { stream } = await prepareSessionRoundStream(auth, body);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    );
  }
}

import { errorResponse, jsonResponse } from "@/lib/server/utils/http";

export async function handleRoute<T>(handler: () => Promise<Response | T>) {
  try {
    const result = await handler();
    return result instanceof Response ? result : jsonResponse(result);
  } catch (error) {
    if (!(error instanceof Error && "status" in error)) {
      console.error("[handleRoute] Unhandled error:", error);
    }
    return errorResponse(error);
  }
}

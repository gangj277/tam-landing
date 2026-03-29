import { errorResponse } from "@/lib/server/utils/http";

export async function handleRoute<T>(handler: () => Promise<Response | T>) {
  try {
    const result = await handler();
    return result instanceof Response ? result : Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

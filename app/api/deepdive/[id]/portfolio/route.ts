import { submitPortfolioEntry, requireAuth } from "@/lib/server/backend";
import { readJson, errorResponse } from "@/lib/server/utils/http";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const { text } = await readJson<{ text: string }>(request);

    const result = await submitPortfolioEntry(auth, id, text);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

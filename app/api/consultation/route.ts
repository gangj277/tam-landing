import { consultationRequests } from "@/lib/server/db/schema";
import { createDb } from "@/lib/server/db/client";
import { generateId } from "@/lib/server/helpers";
import { handleRoute } from "@/lib/server/route";
import { nowIso } from "@/lib/server/utils/date";
import { ApiError, readJson } from "@/lib/server/utils/http";

type ConsultationRequestBody = {
  parentName?: unknown;
  phone?: unknown;
  childAge?: unknown;
  childGrade?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const body = await readJson<ConsultationRequestBody>(request);

    const parentName = typeof body.parentName === "string" ? body.parentName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const childGrade = typeof body.childGrade === "string" ? body.childGrade.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : null;
    const childAge =
      typeof body.childAge === "number"
        ? body.childAge
        : typeof body.childAge === "string" && body.childAge.trim() !== ""
          ? Number(body.childAge)
          : Number.NaN;

    if (!parentName || !phone || !Number.isInteger(childAge) || !childGrade) {
      throw new ApiError(400, "INVALID_CONSULTATION_REQUEST", "Consultation request body is invalid");
    }

    const id = generateId("consult");
    const createdAt = nowIso();
    const db = createDb();

    await db.insert(consultationRequests).values({
      id,
      parentName,
      phone,
      childAge,
      childGrade,
      message,
      status: "pending",
      createdAt,
    });

    return { ok: true, id };
  });
}

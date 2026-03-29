import { z } from "zod";

import { confirmParentPinReset, requestParentPinReset } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";
import { ApiError, readJson } from "@/lib/server/utils/http";

const requestResetSchema = z.object({
  ownerPhone: z.string().regex(/^01\d{8,9}$/, "Must be a valid Korean phone number (10-11 digits starting with 01)"),
});

const confirmResetSchema = z.object({
  resetToken: z.string().min(1),
  newPIN: z.string().regex(/^\d{4}$/),
});

export async function POST(request: Request) {
  return await handleRoute(async () => {
    const body = await readJson<Record<string, unknown>>(request);

    const requestReset = requestResetSchema.safeParse(body);
    if (requestReset.success) {
      return await requestParentPinReset(requestReset.data);
    }

    const confirmReset = confirmResetSchema.safeParse(body);
    if (confirmReset.success) {
      return await confirmParentPinReset(confirmReset.data);
    }

    throw new ApiError(400, "INVALID_RESET_PIN_REQUEST", "Reset PIN request body is invalid");
  });
}

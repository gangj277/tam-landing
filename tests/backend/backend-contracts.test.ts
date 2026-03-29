import { describe, expect, it } from "vitest";

import { POST as epiloguePOST } from "@/app/api/ai/epilogue/route";
import { POST as mirrorPOST } from "@/app/api/ai/mirror/route";
import { POST as scenarioRoundPOST } from "@/app/api/ai/scenario-round/route";
import { POST as signupPOST } from "@/app/api/auth/signup/route";
import { POST as verifyPinPOST } from "@/app/api/auth/verify-pin/route";
import { POST as resetPinPOST } from "@/app/api/auth/reset-pin/route";
import { GET as missionTodayGET } from "@/app/api/missions/today/route";
import { GET as reportPdfGET, POST as reportPdfPOST } from "@/app/api/reports/[reportId]/pdf/route";
import { GET as reportWeeklyGET } from "@/app/api/reports/[childId]/weekly/route";
import { POST as sessionCreatePOST } from "@/app/api/sessions/route";
import { PATCH as sessionChoicePATCH } from "@/app/api/sessions/[sessionId]/choice/route";
import { PATCH as sessionClosingPATCH } from "@/app/api/sessions/[sessionId]/closing/route";
import { PATCH as sessionCompletePATCH } from "@/app/api/sessions/[sessionId]/complete/route";
import { PATCH as sessionReactionPATCH } from "@/app/api/sessions/[sessionId]/reaction/route";

type JsonRecord = Record<string, unknown>;

function extractCookie(response: Response): string {
  return response.headers.get("set-cookie") ?? "";
}

async function json<T extends JsonRecord = JsonRecord>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function signupFamily(phone: string, pin = "1234") {
  const response = await signupPOST(
    new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ownerPhone: phone,
        ownerName: "김지영",
        password: "password-1234",
        parentPIN: pin,
        firstChild: {
          name: "서연",
          age: 12,
        },
      }),
    }),
  );

  expect(response.status).toBe(201);
  return {
    body: await json(response),
    authCookie: extractCookie(response),
  };
}

async function getTodayMission(cookie: string) {
  const response = await missionTodayGET(
    new Request("http://localhost/api/missions/today", {
      headers: { cookie },
    }),
  );
  expect(response.status).toBe(200);
  const body = await json(response);
  return body.mission as JsonRecord;
}

async function completeSession(cookie: string, missionId: string) {
  const createSessionResponse = await sessionCreatePOST(
    new Request("http://localhost/api/sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({ missionId }),
    }),
  );
  expect(createSessionResponse.status).toBe(201);
  const createSessionBody = await json(createSessionResponse);
  const sessionId = String(createSessionBody.sessionId);

  const choiceResponse = await sessionChoicePATCH(
    new Request(`http://localhost/api/sessions/${sessionId}/choice`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        choiceId: "choice-1",
        reflectionNote: "가장 먼저 보호가 필요한 쪽을 떠올렸어",
      }),
    }),
    { params: Promise.resolve({ sessionId }) },
  );
  expect(choiceResponse.status).toBe(200);

  for (const roundIndex of [0, 1, 2]) {
    const roundResponse = await scenarioRoundPOST(
      new Request("http://localhost/api/ai/scenario-round", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie,
        },
        body: JSON.stringify({ sessionId, roundIndex }),
      }),
    );
    expect(roundResponse.status).toBe(200);
    const roundBody = await json(roundResponse);
    const round = roundBody.round as JsonRecord;
    const emotion = ((round.emotionOptions as JsonRecord[])[0] ?? {}) as JsonRecord;
    const method = ((round.methodOptions as JsonRecord[])[0] ?? {}) as JsonRecord;

    const reactionResponse = await sessionReactionPATCH(
      new Request(`http://localhost/api/sessions/${sessionId}/reaction`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie,
        },
        body: JSON.stringify({
          roundIndex,
          emotionId: emotion.id,
          emotionLabel: emotion.label,
          methodId: method.id,
          methodLabel: method.label,
          valueTags: [...((emotion.valueTags as string[]) ?? []), ...((method.valueTags as string[]) ?? [])],
        }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(reactionResponse.status).toBe(200);
  }

  const epilogueResponse = await epiloguePOST(
    new Request("http://localhost/api/ai/epilogue", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({ sessionId }),
    }),
  );
  expect(epilogueResponse.status).toBe(200);

  const closingResponse = await sessionClosingPATCH(
    new Request(`http://localhost/api/sessions/${sessionId}/closing`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        closingResponse: "끝까지 설명하려고 한 점이 기억에 남아",
      }),
    }),
    { params: Promise.resolve({ sessionId }) },
  );
  expect(closingResponse.status).toBe(200);

  const mirrorResponse = await mirrorPOST(
    new Request("http://localhost/api/ai/mirror", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({ sessionId }),
    }),
  );
  expect(mirrorResponse.status).toBe(200);
  const mirrorBody = await json(mirrorResponse);
  const mirror = mirrorBody.mirror as JsonRecord;

  const completeResponse = await sessionCompletePATCH(
    new Request(`http://localhost/api/sessions/${sessionId}/complete`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({ mirrorId: mirror.id }),
    }),
    { params: Promise.resolve({ sessionId }) },
  );
  expect(completeResponse.status).toBe(200);

  return {
    sessionId,
    mirrorId: String(mirror.id),
  };
}

describe("backend contract gaps", () => {
  it("expires stale sessions and prevents resetting the initial choice", async () => {
    const { authCookie } = await signupFamily("01077776666");
    const mission = await getTodayMission(authCookie);
    const missionId = String(mission.id);
    const choices = mission.choices as JsonRecord[];

    const createSessionResponse = await sessionCreatePOST(
      new Request("http://localhost/api/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ missionId }),
      }),
    );
    expect(createSessionResponse.status).toBe(201);
    const createSessionBody = await json(createSessionResponse);
    const sessionId = String(createSessionBody.sessionId);

    const firstChoiceResponse = await sessionChoicePATCH(
      new Request(`http://localhost/api/sessions/${sessionId}/choice`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({
          choiceId: choices[0]?.id,
        }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(firstChoiceResponse.status).toBe(200);

    const secondChoiceResponse = await sessionChoicePATCH(
      new Request(`http://localhost/api/sessions/${sessionId}/choice`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({
          choiceId: choices[1]?.id ?? choices[0]?.id,
        }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(secondChoiceResponse.status).toBe(409);

    const state = (globalThis as { __tamMemoryState__?: { sessions: Map<string, { expiresAt: string; status: string }> } })
      .__tamMemoryState__;
    const existing = state?.sessions.get(sessionId);
    expect(existing).toBeTruthy();
    if (existing) {
      existing.expiresAt = "2020-01-01T00:00:00.000Z";
    }

    const newSessionResponse = await sessionCreatePOST(
      new Request("http://localhost/api/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ missionId }),
      }),
    );
    expect(newSessionResponse.status).toBe(201);
    const newSessionBody = await json(newSessionResponse);
    expect(String(newSessionBody.sessionId)).not.toBe(sessionId);
    expect(state?.sessions.get(sessionId)?.status).toBe("expired");
  });

  it("supports the reset-pin flow end to end in backend-only mode", async () => {
    const { authCookie } = await signupFamily("01099998888");

    const requestResetResponse = await resetPinPOST(
      new Request("http://localhost/api/auth/reset-pin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ownerPhone: "01099998888",
        }),
      }),
    );
    expect(requestResetResponse.status).toBe(200);
    const requestResetBody = await json(requestResetResponse);
    expect(requestResetBody.requested).toBe(true);
    const resetToken = String(requestResetBody.resetTokenPreview);
    expect(resetToken).not.toBe("");

    const confirmResetResponse = await resetPinPOST(
      new Request("http://localhost/api/auth/reset-pin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPIN: "5678",
        }),
      }),
    );
    expect(confirmResetResponse.status).toBe(200);

    const oldPinResponse = await verifyPinPOST(
      new Request("http://localhost/api/auth/verify-pin", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ pin: "1234" }),
      }),
    );
    expect(oldPinResponse.status).toBe(401);

    const newPinResponse = await verifyPinPOST(
      new Request("http://localhost/api/auth/verify-pin", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ pin: "5678" }),
      }),
    );
    expect(newPinResponse.status).toBe(200);
  });

  it("returns a signed weekly report PDF download that can be fetched directly", async () => {
    const { body, authCookie } = await signupFamily("01055554444");
    const activeChild = body.activeChild as JsonRecord;
    const childId = String(activeChild.id);
    const mission = await getTodayMission(authCookie);
    await completeSession(authCookie, String(mission.id));

    const verifyPinResponse = await verifyPinPOST(
      new Request("http://localhost/api/auth/verify-pin", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ pin: "1234" }),
      }),
    );
    expect(verifyPinResponse.status).toBe(200);
    const parentCookie = extractCookie(verifyPinResponse);

    const weeklyReportResponse = await reportWeeklyGET(
      new Request(`http://localhost/api/reports/${childId}/weekly`, {
        headers: { cookie: parentCookie },
      }),
      { params: Promise.resolve({ childId }) },
    );
    expect(weeklyReportResponse.status).toBe(200);
    const weeklyReportBody = await json(weeklyReportResponse);
    const report = weeklyReportBody.report as JsonRecord;
    const reportId = String(report.id);

    const createPdfResponse = await reportPdfPOST(
      new Request(`http://localhost/api/reports/${reportId}/pdf`, {
        method: "POST",
        headers: { cookie: parentCookie },
      }),
      { params: Promise.resolve({ reportId }) },
    );
    expect(createPdfResponse.status).toBe(200);
    const createPdfBody = await json(createPdfResponse);
    const downloadUrl = String(createPdfBody.downloadUrl);
    expect(downloadUrl).toContain(`/api/reports/${reportId}/pdf`);

    const pdfResponse = await reportPdfGET(
      new Request(downloadUrl),
      { params: Promise.resolve({ reportId }) },
    );
    expect(pdfResponse.status).toBe(200);
    expect(pdfResponse.headers.get("content-type")).toContain("application/pdf");

    const pdfBytes = new Uint8Array(await pdfResponse.arrayBuffer());
    const pdfSignature = new TextDecoder().decode(pdfBytes.slice(0, 4));
    expect(pdfSignature).toBe("%PDF");
  });
});

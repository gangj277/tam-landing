import { describe, expect, it } from "vitest";

import { POST as signupPOST } from "@/app/api/auth/signup/route";
import { POST as verifyPinPOST } from "@/app/api/auth/verify-pin/route";
import { GET as familyMeGET } from "@/app/api/family/me/route";
import { GET as missionTodayGET } from "@/app/api/missions/today/route";
import { POST as sessionCreatePOST, GET as sessionsListGET } from "@/app/api/sessions/route";
import { GET as sessionGetGET } from "@/app/api/sessions/[sessionId]/route";
import { PATCH as sessionChoicePATCH } from "@/app/api/sessions/[sessionId]/choice/route";
import { PATCH as sessionReactionPATCH } from "@/app/api/sessions/[sessionId]/reaction/route";
import { PATCH as sessionToolPATCH } from "@/app/api/sessions/[sessionId]/tool/route";
import { PATCH as sessionClosingPATCH } from "@/app/api/sessions/[sessionId]/closing/route";
import { POST as scenarioRoundPOST } from "@/app/api/ai/scenario-round/route";
import { POST as thinkingToolPOST } from "@/app/api/ai/thinking-tool/route";
import { POST as epiloguePOST } from "@/app/api/ai/epilogue/route";
import { POST as mirrorPOST } from "@/app/api/ai/mirror/route";
import { PATCH as sessionCompletePATCH } from "@/app/api/sessions/[sessionId]/complete/route";
import { GET as profileGET } from "@/app/api/profiles/[childId]/route";
import { GET as reportWeeklyGET } from "@/app/api/reports/[childId]/weekly/route";

type JsonRecord = Record<string, unknown>;

function extractCookie(response: Response): string {
  return response.headers.get("set-cookie") ?? "";
}

async function json(response: Response): Promise<JsonRecord> {
  return (await response.json()) as JsonRecord;
}

describe("tam backend server flow", () => {
  it("supports signup through weekly report generation without the frontend", async () => {
    const signupResponse = await signupPOST(
      new Request("http://localhost/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ownerPhone: "01012345678",
          ownerName: "김지영",
          password: "password-1234",
          parentPIN: "1234",
          firstChild: {
            name: "서연",
            age: 12,
          },
        }),
      }),
    );

    expect(signupResponse.status).toBe(201);
    const authCookie = extractCookie(signupResponse);
    expect(authCookie).toContain("tam_auth=");

    const signupBody = await json(signupResponse);
    const activeChild = signupBody.activeChild as JsonRecord;
    const childId = String(activeChild.id);

    const familyMeResponse = await familyMeGET(
      new Request("http://localhost/api/family/me", {
        headers: { cookie: authCookie },
      }),
    );
    expect(familyMeResponse.status).toBe(200);

    const todayMissionResponse = await missionTodayGET(
      new Request("http://localhost/api/missions/today", {
        headers: { cookie: authCookie },
      }),
    );
    expect(todayMissionResponse.status).toBe(200);
    const todayMissionBody = await json(todayMissionResponse);
    const mission = todayMissionBody.mission as JsonRecord;
    const missionId = String(mission.id);

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

    const initialChoice = ((mission.choices as JsonRecord[])[0] ?? {}) as JsonRecord;
    const choiceResponse = await sessionChoicePATCH(
      new Request(`http://localhost/api/sessions/${sessionId}/choice`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({
          choiceId: initialChoice.id,
          reflectionNote: "당장 아픈 사람이 먼저라고 생각했어",
        }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(choiceResponse.status).toBe(200);

    const round0Response = await scenarioRoundPOST(
      new Request("http://localhost/api/ai/scenario-round", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ sessionId, roundIndex: 0 }),
      }),
    );
    expect(round0Response.status).toBe(200);
    const round0Body = await json(round0Response);
    const round0 = round0Body.round as JsonRecord;

    for (const roundIndex of [0, 1, 2]) {
      let round = round0;
      if (roundIndex !== 0) {
        const roundResponse = await scenarioRoundPOST(
          new Request("http://localhost/api/ai/scenario-round", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              cookie: authCookie,
            },
            body: JSON.stringify({ sessionId, roundIndex }),
          }),
        );
        const roundBody = await json(roundResponse);
        round = roundBody.round as JsonRecord;
      }

      const emotion = ((round.emotionOptions as JsonRecord[])[0] ?? {}) as JsonRecord;
      const method = ((round.methodOptions as JsonRecord[])[0] ?? {}) as JsonRecord;

      const reactionResponse = await sessionReactionPATCH(
        new Request(`http://localhost/api/sessions/${sessionId}/reaction`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            cookie: authCookie,
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

      if (roundIndex === 1) {
        const toolResponse = await sessionToolPATCH(
          new Request(`http://localhost/api/sessions/${sessionId}/tool`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
              cookie: authCookie,
            },
            body: JSON.stringify({
              roundIndex,
              toolType: "reframe",
            }),
          }),
          { params: Promise.resolve({ sessionId }) },
        );
        expect(toolResponse.status).toBe(200);

        const thinkingToolResponse = await thinkingToolPOST(
          new Request("http://localhost/api/ai/thinking-tool", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              cookie: authCookie,
            },
            body: JSON.stringify({
              sessionId,
              roundIndex,
              toolType: "reframe",
            }),
          }),
        );
        expect(thinkingToolResponse.status).toBe(200);
      }
    }

    const epilogueResponse = await epiloguePOST(
      new Request("http://localhost/api/ai/epilogue", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
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
          cookie: authCookie,
        },
        body: JSON.stringify({
          closingResponse: "시장으로서 솔직하게 말하는 게 제일 어려웠어",
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
          cookie: authCookie,
        },
        body: JSON.stringify({ sessionId }),
      }),
    );
    expect(mirrorResponse.status).toBe(200);
    const mirrorBody = await json(mirrorResponse);
    const mirror = mirrorBody.mirror as JsonRecord;
    const mirrorId = String(mirror.id);

    const completeResponse = await sessionCompletePATCH(
      new Request(`http://localhost/api/sessions/${sessionId}/complete`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie: authCookie,
        },
        body: JSON.stringify({ mirrorId }),
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(completeResponse.status).toBe(200);

    const sessionResponse = await sessionGetGET(
      new Request(`http://localhost/api/sessions/${sessionId}`, {
        headers: { cookie: authCookie },
      }),
      { params: Promise.resolve({ sessionId }) },
    );
    expect(sessionResponse.status).toBe(200);

    const sessionsListResponse = await sessionsListGET(
      new Request(`http://localhost/api/sessions?childId=${childId}&status=completed`, {
        headers: { cookie: authCookie },
      }),
    );
    expect(sessionsListResponse.status).toBe(200);

    const profileResponse = await profileGET(
      new Request(`http://localhost/api/profiles/${childId}`, {
        headers: { cookie: authCookie },
      }),
      { params: Promise.resolve({ childId }) },
    );
    expect(profileResponse.status).toBe(200);
    const profileBody = await json(profileResponse);
    const profile = profileBody.profile as JsonRecord;
    const stats = profile.stats as JsonRecord;
    expect(stats.totalMissions).toBe(1);

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

    const reportResponse = await reportWeeklyGET(
      new Request(`http://localhost/api/reports/${childId}/weekly`, {
        headers: { cookie: parentCookie },
      }),
      { params: Promise.resolve({ childId }) },
    );
    expect(reportResponse.status).toBe(200);
    const reportBody = await json(reportResponse);
    const report = reportBody.report as JsonRecord;
    expect(Array.isArray(report.patterns)).toBe(true);
  });
});

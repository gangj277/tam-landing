import { afterEach, describe, expect, it, vi } from "vitest";

import { getTodayActivity } from "@/lib/api-client";

describe("api-client cache policy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables browser caching for authenticated GET requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        type: "mission",
        mission: {
          id: "mission-1",
          title: "화성 시장",
          role: "시장",
          category: "leadership",
          difficulty: "easy",
          worldSetting: {
            location: "화성",
            era: "미래",
            backdrop: "돔 도시",
          },
          situation: "상황",
          coreQuestion: "질문",
          choices: [],
          aiContext: {
            persona: "mentor",
            followUpAngles: [],
            expansionTools: [],
          },
          tags: [],
          estimatedMinutes: 5,
          ageRange: [10, 13],
        },
        reason: "오늘의 미션",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await getTodayActivity();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/activity/today",
      expect.objectContaining({
        cache: "no-store",
        credentials: "include",
      }),
    );
  });
});

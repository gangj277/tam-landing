import { describe, expect, it } from "vitest";

import { handleRoute } from "@/lib/server/route";

describe("handleRoute cache policy", () => {
  it("marks wrapped JSON API responses as non-cacheable", async () => {
    const response = await handleRoute(async () => ({ ok: true }));

    expect(response.headers.get("cache-control")).toBe("no-store, private");
  });
});

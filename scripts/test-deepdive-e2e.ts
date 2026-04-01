/**
 * E2E Test Script: Deep-Dive Engine
 * Run: npx tsx scripts/test-deepdive-e2e.ts
 * Requires dev server on localhost:3000 (TAM_DATA_BACKEND=memory TAM_AI_MODE=mock)
 */

const BASE = "http://localhost:3000";
let authCookie = "";
let childId = "";

async function api(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(authCookie ? { Cookie: authCookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  const sc = res.headers.get("set-cookie");
  if (sc) { const m = sc.match(/tam_auth=[^;]+/); if (m) authCookie = m[0]; }
  let data: any = {};
  try { data = await res.json(); } catch {}
  return { s: res.status, d: data };
}

function ok(s: number) { return s >= 200 && s < 300; }
function t(pass: boolean, msg: string) {
  if (!pass) { console.error(`  FAIL: ${msg}`); process.exit(1); }
  console.log(`  PASS: ${msg}`);
}
function h(title: string) { console.log(`\n${"=".repeat(50)}\n  ${title}\n${"=".repeat(50)}`); }

async function main() {
  console.log("\n  Deep-Dive Engine E2E Test\n  " + "─".repeat(40));

  // ── 1. Signup ──
  h("1. Signup");
  const phone = `010-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}`;
  const signup = await api("POST", "/api/auth/signup", {
    ownerName: "테스트부모", ownerPhone: phone, password: "test1234",
    parentPIN: "1234", firstChild: { name: "테스트아이", age: 12 },
  });
  t(ok(signup.s), `Signup: ${signup.s}`);
  t(!!authCookie, "Auth cookie");
  const me = await api("GET", "/api/family/me");
  t(ok(me.s), `Family me: ${me.s}`);
  childId = me.d.activeChildId;
  t(!!childId, `Child: ${childId}`);

  // ── 2. Day 1 Mission ──
  h("2. Day 1 Mission");
  const act = await api("GET", "/api/activity/today");
  t(ok(act.s), `Activity: ${act.s}`);
  t(act.d.type === "mission", `Type: ${act.d.type}`);
  const missionId = act.d.mission?.id;
  t(!!missionId, `Mission: ${act.d.mission?.title}`);

  const sess = await api("POST", "/api/sessions", { missionId });
  t(ok(sess.s), `Session: ${sess.s}`);
  const sid = sess.d.sessionId;

  const ch = await api("PATCH", `/api/sessions/${sid}/choice`, { choiceId: act.d.mission.choices[0].id });
  t(ok(ch.s), "Choice recorded");

  for (let r = 0; r < 5; r++) {
    const rd = await api("POST", "/api/ai/scenario-round", { sessionId: sid, roundIndex: r });
    t(ok(rd.s), `Round ${r} gen`);
    const emo = rd.d.emotionOptions?.[0];
    const mth = rd.d.methodOptions?.[0];
    const rx = await api("PATCH", `/api/sessions/${sid}/reaction`, {
      roundIndex: r, emotionId: emo?.id ?? "e", emotionLabel: "t",
      methodId: mth?.id ?? "m", methodLabel: "t", valueTags: [...(emo?.valueTags??[]), ...(mth?.valueTags??[])],
    });
    t(ok(rx.s), `Round ${r} react`);
  }

  t(ok((await api("PATCH", `/api/sessions/${sid}/closing`, { closingResponse: "test" })).s), "Closing");
  t(ok((await api("POST", "/api/ai/epilogue", { sessionId: sid })).s), "Epilogue");
  const mir = await api("POST", "/api/ai/mirror", { sessionId: sid });
  t(ok(mir.s), "Mirror");
  t(ok((await api("PATCH", `/api/sessions/${sid}/complete`, { mirrorId: mir.d.id })).s), "Complete");
  console.log("  Mission fully completed!");

  // ── 3. Deep-Dive Create ──
  h("3. Deep-Dive Create");
  const dd = await api("POST", "/api/deepdive", { missionId: "mission-mars-mayor" });
  t(ok(dd.s), `Create: ${dd.s}`);
  const ddId = dd.d.deepDive?.id;
  const steps = dd.d.deepDive?.steps ?? [];
  t(!!ddId, `DD ID: ${ddId}`);
  t(steps.length === 4, `Steps: ${steps.length}`);
  t(steps[0]?.type === "case", "Step 0 = case");
  t(steps[1]?.type === "question", "Step 1 = question");
  t(steps[2]?.type === "opinion", "Step 2 = opinion");
  t(steps[3]?.type === "portfolio", "Step 3 = portfolio");

  // Verify question JSON
  const qs = JSON.parse(steps[1].prompt);
  t(Array.isArray(qs), `Questions: ${qs.length} items`);
  t(!!qs[0].prompt, `Q1: "${qs[0].prompt.slice(0,30)}..."`);
  t(Array.isArray(qs[0].options), "Q1 has options");

  // Verify opinion JSON
  const op = JSON.parse(steps[2].prompt);
  t(!!op.template, `Opinion template: "${op.template.slice(0,30)}..."`);
  t(Array.isArray(op.scaffolds) && op.scaffolds.length > 0, `Scaffolds: ${op.scaffolds.length}`);

  // ── 4. Deep-Dive Detail ──
  h("4. Deep-Dive Detail");
  const det = await api("GET", `/api/deepdive/${ddId}`);
  t(ok(det.s), "Detail fetched");
  t(!!det.d.linkedMission, `Linked: ${det.d.linkedMission?.title}`);

  // ── 5. Step Responses ──
  h("5. Step Responses");
  t(ok((await api("POST", `/api/deepdive/${ddId}/step`, { stepIndex: 0, response: "read" })).s), "Step 0: read");
  t(ok((await api("POST", `/api/deepdive/${ddId}/step`, { stepIndex: 1, response: JSON.stringify({"q1":"a","q2":"b"}) })).s), "Step 1: answers");
  t(ok((await api("POST", `/api/deepdive/${ddId}/step`, { stepIndex: 2, response: JSON.stringify({value:"공정",reason:"모두가 살아야"}) })).s), "Step 2: opinion");
  t(ok((await api("POST", `/api/deepdive/${ddId}/step`, { stepIndex: 3, response: "confirmed" })).s), "Step 3: portfolio");

  // ── 6. Complete Deep-Dive ──
  h("6. Complete");
  const pe = "화성 자원 배분 시뮬레이션과 케냐 가뭄 사례를 비교하며 공정성과 생존의 균형이 중요하다는 입장을 정리함";
  const comp = await api("PATCH", `/api/deepdive/${ddId}/complete`, { portfolioEntry: pe });
  t(ok(comp.s), `Complete: ${comp.s}`);
  // Verify completion by fetching detail
  const afterComp = await api("GET", `/api/deepdive/${ddId}`);
  t(afterComp.d.deepDive?.status === "completed", "Status = completed");
  t(afterComp.d.deepDive?.portfolioEntry === pe, "Portfolio saved");

  // ── 7. Portfolio ──
  h("7. Portfolio");
  const pf = await api("GET", `/api/portfolio?childId=${childId}`);
  t(ok(pf.s), `Portfolio: ${pf.s}`);
  t(Array.isArray(pf.d.entries), "Has entries");
  t(pf.d.entries.length >= 1, `${pf.d.entries.length} entries`);

  // ── 8. Profile Stats ──
  h("8. Profile Stats");
  const pr = await api("GET", `/api/profiles/${childId}`);
  t(ok(pr.s), `Profile: ${pr.s}`);
  const stats = pr.d.profile?.stats ?? pr.d.stats ?? {};
  console.log(`  missions=${stats.totalMissions} deepDives=${stats.totalDeepDives} portfolio=${stats.portfolioEntries}`);
  t((stats.totalDeepDives ?? 0) >= 1, "totalDeepDives >= 1");
  t((stats.portfolioEntries ?? 0) >= 1, "portfolioEntries >= 1");

  // ── 9. All 7 Hardcoded ──
  h("9. All 7 Hardcoded Deep-Dives");
  const ids = ["mission-animal-rescue","mission-fairness","mission-three-perspectives","mission-hidden-design","mission-fun-vs-safety","mission-one-line"];
  for (const mid of ids) {
    const r = await api("POST", "/api/deepdive", { missionId: mid });
    t(ok(r.s), `${mid}: created`);
    t(r.d.deepDive?.steps?.length === 4, `${mid}: 4 steps`);
    console.log(`  → "${r.d.deepDive?.title}"`);
  }

  // ── 10. Edge Cases ──
  h("10. Edge Cases");
  const bad = await api("POST", "/api/deepdive", { missionId: "nonexistent" });
  t(bad.s === 404, `Nonexistent: ${bad.s}`);

  const list = await api("GET", "/api/deepdive");
  t(ok(list.s), `List: ${list.s}`);
  const completedDd = (list.d.deepDives ?? []).find((d: any) => d.status === "completed");
  if (completedDd) {
    const re = await api("PATCH", `/api/deepdive/${completedDd.id}/complete`, { portfolioEntry: "x" });
    t(re.s >= 400, `Re-complete blocked: ${re.s}`);
  }

  console.log(`\n${"=".repeat(50)}\n  ALL TESTS PASSED\n${"=".repeat(50)}\n`);
}

main().catch((e) => { console.error("ERROR:", e); process.exit(1); });

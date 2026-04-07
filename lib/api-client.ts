// ─── API Client ───
// All frontend API calls go through this module.
// Replaces dummy-data imports when connected to the real backend.

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: options?.cache ?? "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const code = body?.error?.code ?? `HTTP_${res.status}`;
    const message = body?.error?.message ?? res.statusText;
    throw new ApiError(res.status, code, message);
  }
  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// ─── Auth / Family ───

export interface PublicChild {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  isDefault: boolean;
}

export interface FamilyMe {
  familyId: string;
  ownerName: string;
  ownerPhone: string;
  activeChildId: string;
  activeChild: PublicChild;
  children: PublicChild[];
  parentVerified: boolean;
}

export async function signup(body: {
  ownerPhone: string;
  ownerName: string;
  password: string;
  parentPIN: string;
  firstChild: { name: string; age: number };
}) {
  return request<{ familyId: string; token: string; activeChild: PublicChild }>(
    "/auth/signup",
    { method: "POST", body: JSON.stringify(body) },
  );
}

export async function login(phone: string, password: string) {
  return request<{ familyId: string; token: string; children: PublicChild[]; activeChildId: string }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ phone, password }) },
  );
}

export async function verifyPin(pin: string) {
  return request<{ verified: boolean; expiresIn: number }>(
    "/auth/verify-pin",
    { method: "POST", body: JSON.stringify({ pin }) },
  );
}

export async function getFamilyMe() {
  return request<FamilyMe>("/family/me");
}

export async function switchActiveChild(childId: string) {
  return request<{ activeChildId: string; name: string }>(
    "/family/active-child",
    { method: "PATCH", body: JSON.stringify({ childId }) },
  );
}

export async function addChild(name: string, age: number) {
  return request<{ child: PublicChild }>(
    "/family/children",
    { method: "POST", body: JSON.stringify({ name, age }) },
  );
}

// ─── Missions ───

export interface MissionData {
  id: string;
  title: string;
  role: string;
  category: string;
  difficulty: string;
  worldSetting: { location: string; era: string; backdrop: string };
  situation: string;
  coreQuestion: string;
  choices: {
    id: string;
    label: string;
    shortLabel: string;
    reasoning: string;
    valueTags: string[];
  }[];
  aiContext: {
    persona: string;
    followUpAngles: string[];
    expansionTools: {
      type: string;
      label: string;
      icon: string;
      prompts: string[];
    }[];
  };
  tags: string[];
  estimatedMinutes: number;
  ageRange: [number, number];
}

export interface MissionPreviewData {
  index: number;
  title: string;
  role: string;
  category: string;
  worldLocation: string;
  era: string;
  pitch: string;
}

export type TodayMissionResponse =
  | { status: "sequence"; mission: MissionData; reason: string }
  | { status: "choosing"; previews: MissionPreviewData[]; choiceSetId: string }
  | { status: "chosen"; mission: MissionData; reason: string };

export async function getTodayMission() {
  return request<TodayMissionResponse>("/missions/today");
}

export async function chooseTodayMission(chosenIndex: number) {
  return request<{ mission: MissionData; reason: string }>("/missions/today/choose", {
    method: "POST",
    body: JSON.stringify({ chosenIndex }),
  });
}

export async function getTomorrowMission() {
  return request<{ mission: MissionData; reason: string }>("/missions/tomorrow");
}

export async function getMission(id: string) {
  return request<{ mission: MissionData }>(`/missions/${id}`);
}

// ─── Sessions ───

export interface PastSessionItem {
  sessionId: string;
  missionId: string;
  missionTitle: string;
  category: string;
  completedAt: string;
  choiceSummary: string;
}

export async function createSession(missionId: string) {
  return request<{ sessionId: string; startedAt: string; reused: boolean }>(
    "/sessions",
    { method: "POST", body: JSON.stringify({ missionId }) },
  );
}

export async function listSessions(limit = 10) {
  return request<{ sessions: PastSessionItem[] }>(`/sessions?limit=${limit}`);
}

export async function getSession(sessionId: string) {
  return request<{ session: Record<string, unknown>; mission: MissionData; reactions: unknown[]; toolsUsed: unknown[]; generatedRounds: unknown[]; thinkingToolCards: unknown[]; epilogue: unknown | null; mirror: unknown | null }>(
    `/sessions/${sessionId}`,
  );
}

export async function recordChoice(sessionId: string, choiceId: string, reflectionNote?: string) {
  return request<{ ok: true }>(
    `/sessions/${sessionId}/choice`,
    { method: "PATCH", body: JSON.stringify({ choiceId, reflectionNote }) },
  );
}

export async function recordReaction(
  sessionId: string,
  roundIndex: number,
  emotionId: string,
  emotionLabel: string,
  methodId: string,
  methodLabel: string,
  valueTags: string[],
) {
  return request<{ ok: true }>(
    `/sessions/${sessionId}/reaction`,
    {
      method: "PATCH",
      body: JSON.stringify({ roundIndex, emotionId, emotionLabel, methodId, methodLabel, valueTags }),
    },
  );
}

export async function recordToolUsage(sessionId: string, roundIndex: number, toolType: string) {
  return request<{ ok: true }>(
    `/sessions/${sessionId}/tool`,
    { method: "PATCH", body: JSON.stringify({ roundIndex, toolType }) },
  );
}

export async function recordClosing(sessionId: string, closingResponse: string) {
  return request<{ ok: true }>(
    `/sessions/${sessionId}/closing`,
    { method: "PATCH", body: JSON.stringify({ closingResponse }) },
  );
}

export async function completeSession(sessionId: string, mirrorId?: string) {
  return request<{ ok: true }>(
    `/sessions/${sessionId}/complete`,
    { method: "PATCH", body: JSON.stringify({ mirrorId }) },
  );
}

// ─── AI Generation ───

export interface GeneratedRound {
  id: string;
  roundIndex: number;
  consequence: { narrative: string; newDilemma: string };
  reflectionHint?: string;
  emotionOptions: { id: string; emoji: string; label: string; valueTags: string[] }[];
  methodOptions: { id: string; emoji: string; label: string; valueTags: string[] }[];
  thinkingTools: { type: string; label: string; emoji: string }[];
}

export interface GeneratedEpilogue {
  id: string;
  title: string;
  scenes: { text: string; mood: string }[];
  closingLine: string;
}

export interface GeneratedMirror {
  id: string;
  sessionId: string;
  childId: string;
  missionId: string;
  observations: { text: string; valueTags: string[]; tone: string }[];
  patternNote: string | null;
  nextSuggestion: { reason: string; categoryHint: string } | null;
  createdAt: string;
}

export interface ThinkingToolCardResult {
  type: string;
  label: string;
  emoji: string;
  card: { narrative: string };
}

export async function generateScenarioRound(sessionId: string, roundIndex: number) {
  return request<{ round: GeneratedRound }>(
    "/ai/scenario-round",
    { method: "POST", body: JSON.stringify({ sessionId, roundIndex }) },
  );
}

// Extract narrative text from partial JSON being streamed.
// The JSON structure is: {"consequence":{"narrative":"TEXT HERE","newDilemma":"..."},...}
// We extract the value of the "narrative" field as it grows.
function extractNarrativeFromPartialJson(accumulated: string): string {
  // Find the start of the narrative value
  const marker = '"narrative":"';
  const startIdx = accumulated.indexOf(marker);
  if (startIdx === -1) return "";

  const contentStart = startIdx + marker.length;
  // Extract everything after the marker, handling escape sequences
  let result = "";
  let i = contentStart;
  while (i < accumulated.length) {
    const ch = accumulated[i];
    if (ch === "\\") {
      // Escaped character
      const next = accumulated[i + 1];
      if (next === "n") { result += "\n"; i += 2; continue; }
      if (next === '"') { result += '"'; i += 2; continue; }
      if (next === "\\") { result += "\\"; i += 2; continue; }
      if (next === "t") { result += "\t"; i += 2; continue; }
      if (next === undefined) break; // incomplete escape at end
      result += next; i += 2; continue;
    }
    if (ch === '"') break; // End of narrative string value
    result += ch;
    i++;
  }
  return result;
}

// Streaming version — extracts narrative text in real-time from the JSON stream
export async function streamScenarioRound(
  sessionId: string,
  roundIndex: number,
  onNarrative: (narrativeText: string) => void,
  onComplete: (round: GeneratedRound) => void,
  onError: (message: string) => void,
): Promise<void> {
  const res = await fetch(`${"/api"}/ai/scenario-round-stream`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, roundIndex }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    onError(body?.error?.message ?? `HTTP ${res.status}`);
    return;
  }

  if (!res.body) {
    onError("No response body");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulatedJson = ""; // Full JSON being built
  let lastNarrativeLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (currentEvent === "token" && parsed.t) {
            accumulatedJson += parsed.t;
            // Extract narrative and emit only new characters
            const narrative = extractNarrativeFromPartialJson(accumulatedJson);
            if (narrative.length > lastNarrativeLength) {
              onNarrative(narrative);
              lastNarrativeLength = narrative.length;
            }
          } else if (currentEvent === "complete") {
            onComplete(parsed as GeneratedRound);
          } else if (currentEvent === "error") {
            onError(parsed.message ?? "Stream error");
          }
        } catch {
          // skip malformed lines
        }
        currentEvent = "";
      }
    }
  }
}

export async function generateThinkingTool(sessionId: string, roundIndex: number, toolType: string) {
  return request<{ card: ThinkingToolCardResult }>(
    "/ai/thinking-tool",
    { method: "POST", body: JSON.stringify({ sessionId, roundIndex, toolType }) },
  );
}

export async function streamThinkingTool(
  sessionId: string,
  roundIndex: number,
  toolType: string,
  onNarrative: (text: string) => void,
  onComplete: (narrative: string) => void,
  onError: (message: string) => void,
): Promise<void> {
  const res = await fetch(`${"/api"}/ai/thinking-tool-stream`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, roundIndex, toolType }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    onError(body?.error?.message ?? `HTTP ${res.status}`);
    return;
  }

  if (!res.body) {
    onError("No response body");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (currentEvent === "token" && parsed.t) {
            accumulated += parsed.t;
            // Extract narrative from partial JSON: {"narrative":"TEXT..."}
            const narrative = extractNarrativeFromPartialJson(accumulated);
            if (narrative) {
              onNarrative(narrative);
            }
          } else if (currentEvent === "complete") {
            onComplete(parsed.narrative ?? accumulated);
          } else if (currentEvent === "error") {
            onError(parsed.message ?? "Stream error");
          }
        } catch {
          // skip malformed lines
        }
        currentEvent = "";
      }
    }
  }
}

export async function generateEpilogue(sessionId: string) {
  return request<{ epilogue: GeneratedEpilogue }>(
    "/ai/epilogue",
    { method: "POST", body: JSON.stringify({ sessionId }) },
  );
}

export async function generateMirror(sessionId: string) {
  return request<{ mirror: GeneratedMirror }>(
    "/ai/mirror",
    { method: "POST", body: JSON.stringify({ sessionId }) },
  );
}

// ─── Profiles ───

export interface ProfileData {
  id: string;
  childId: string;
  name: string;
  age: number;
  createdAt: string;
  stats: {
    totalMissions: number;
    currentStreak: number;
    longestStreak: number;
    totalMinutes: number;
  };
  discoveries: Record<
    string,
    { label: string; summary: string; dataPoints: number; confidence: string; icon: string }
  >;
  interestMap: { category: string; score: number; trend: string }[];
  updatedAt: string;
}

export async function getProfile(childId: string) {
  return request<{ profile: ProfileData }>(`/profiles/${childId}`);
}

export async function recalculateProfile(childId: string) {
  return request<{ profile: ProfileData; updated: boolean }>(
    `/profiles/${childId}/recalculate`,
    { method: "POST" },
  );
}

// ─── Reports ───

export interface WeeklyReportData {
  id: string;
  childId: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  summary: {
    missionsCompleted: number;
    totalMinutes: number;
    streak: number;
    worldsExplored: string[];
  };
  patterns: { title: string; detail: string; stat?: string }[];
  interestChanges: {
    category: string;
    currentScore: number;
    previousScore: number;
    delta: number;
    trend: string;
  }[];
  guideComment: string;
}

export async function getWeeklyReport(childId: string, week?: string) {
  const q = week ? `?week=${week}` : "";
  return request<{ report: WeeklyReportData }>(`/reports/${childId}/weekly${q}`);
}

export async function listReports(childId: string) {
  return request<{ reports: { id: string; weekStart: string; missionsCompleted: number }[] }>(
    `/reports/${childId}/list`,
  );
}

// ─── Deep-Dive ───

export interface ExpertPersonaData {
  name: string;
  role: string;
  organization: string;
}

export interface PortfolioEntry {
  deepDiveId: string;
  missionTitle: string;
  expertName: string;
  title: string;
  portfolioEntry: string;
  completedAt: string;
}

export interface AgentStateData {
  casePresentedAtIndex: number | null;
  insightCount: number;
  turnCount: number;
  endingInitiated: boolean;
  portfolioRequested: boolean;
}

export interface DeepDiveMessage {
  id: string;
  messageIndex: number;
  role: "expert" | "child";
  content: string;
}

export interface DeepDiveData {
  id: string;
  missionId: string;
  expert: { name: string; role: string; organization: string };
  messages: DeepDiveMessage[];
  agentState: AgentStateData;
  portfolioEntry: string | null;
  status: "active" | "completed";
}

export async function createDeepDive(missionId: string, sessionId: string) {
  return request<{ deepDiveId: string; reused: boolean }>(
    "/deepdive",
    { method: "POST", body: JSON.stringify({ missionId, sessionId }) },
  );
}

export async function getDeepDive(deepDiveId: string): Promise<DeepDiveData | null> {
  try {
    const { deepDive } = await request<{ deepDive: DeepDiveData }>(`/deepdive/${deepDiveId}`);
    return deepDive;
  } catch {
    return null;
  }
}

export async function getPortfolio(childId?: string) {
  const q = childId ? `?childId=${childId}` : "";
  return request<{ entries: PortfolioEntry[] }>(`/portfolio${q}`);
}

export async function streamDeepDiveChat(
  deepDiveId: string,
  childMessage: string | null,
  onToken: (text: string) => void,
  onComplete: (data: {
    message: string;
    agentState: AgentStateData;
    isEnding: boolean;
  }) => void,
  onError: (err: Error) => void,
): Promise<void> {
  const res = await fetch(`${BASE}/deepdive/${deepDiveId}/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: childMessage }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    onError(new Error(body?.error?.message ?? `HTTP ${res.status}`));
    return;
  }

  if (!res.body) {
    onError(new Error("No response body"));
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (currentEvent === "token" && parsed.t) {
            accumulated += parsed.t;
            // Only show the "message" field content — never raw JSON or toolCalls
            const msg = extractMessageFromPartial(accumulated);
            if (msg) {
              onToken(msg);
            }
          } else if (currentEvent === "complete") {
            onComplete({
              message: parsed.message ?? accumulated,
              agentState: parsed.agentState ?? {
                casePresentedAtIndex: null,
                insightCount: 0,
                turnCount: 0,
                endingInitiated: false,
                portfolioRequested: false,
              },
              isEnding: parsed.isEnding ?? false,
            });
          } else if (currentEvent === "error") {
            onError(new Error(parsed.message ?? "Stream error"));
          }
        } catch {
          // skip malformed lines
        }
        currentEvent = "";
      }
    }
  }
}

// Extract "message" field from partial JSON (agent stream format)
function extractMessageFromPartial(accumulated: string): string {
  const marker = '"message":"';
  const startIdx = accumulated.indexOf(marker);
  if (startIdx === -1) return "";

  const contentStart = startIdx + marker.length;
  let result = "";
  let i = contentStart;
  while (i < accumulated.length) {
    const ch = accumulated[i];
    if (ch === "\\") {
      const next = accumulated[i + 1];
      if (next === "n") { result += "\n"; i += 2; continue; }
      if (next === '"') { result += '"'; i += 2; continue; }
      if (next === "\\") { result += "\\"; i += 2; continue; }
      if (next === "t") { result += "\t"; i += 2; continue; }
      if (next === undefined) break;
      result += next; i += 2; continue;
    }
    if (ch === '"') break;
    result += ch;
    i++;
  }
  return result;
}

export async function submitDeepDivePortfolio(
  deepDiveId: string,
  text: string,
): Promise<{ ok: boolean; completedAt: string }> {
  return request<{ ok: boolean; completedAt: string }>(
    `/deepdive/${deepDiveId}/portfolio`,
    { method: "POST", body: JSON.stringify({ text }) },
  );
}

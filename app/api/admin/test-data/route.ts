import { HARDCODED_DEEP_DIVES } from "@/lib/dummy-data";

export async function GET() {
  const deepDives = HARDCODED_DEEP_DIVES.map((dd) => ({
    missionId: dd.missionId,
    expertName: dd.expert.name,
    expertRole: dd.expert.role,
    expertOrg: dd.expert.organization,
    title: dd.realWorldCase.headline,
    caseHeadline: dd.realWorldCase.context.slice(0, 80) + "...",
  }));

  return Response.json({ deepDives });
}

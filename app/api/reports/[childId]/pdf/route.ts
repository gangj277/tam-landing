import { generateReportPdf, requireAuth, resolveReportPdfDownload } from "@/lib/server/backend";
import { handleRoute } from "@/lib/server/route";

export async function POST(
  request: Request,
  context: { params: Promise<{ childId: string }> },
) {
  return await handleRoute(async () => {
    const auth = await requireAuth(request, { requireParent: true });
    const { childId } = await context.params;
    return await generateReportPdf(auth, childId, new URL(request.url).origin);
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ childId: string }> },
) {
  return await handleRoute(async () => {
    const { childId } = await context.params;
    const token = new URL(request.url).searchParams.get("token");
    if (!token) {
      return Response.json(
        {
          error: {
            code: "REPORT_DOWNLOAD_TOKEN_REQUIRED",
            message: "A signed report download token is required",
          },
        },
        { status: 401 },
      );
    }

    const { child, pdfBytes, report } = await resolveReportPdfDownload(childId, token);
    const stableBytes = Uint8Array.from(pdfBytes);
    const body = stableBytes.buffer;
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="tam-weekly-report-${child.id}-${report.weekStart}.pdf"`,
        "cache-control": "private, max-age=300",
      },
    });
  });
}

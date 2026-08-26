import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { linkId, pageNumber = 1, durationSeconds = 3 } = body;

    if (!linkId) {
      return NextResponse.json({ error: "linkId requis" }, { status: 400 });
    }

    const doc = await prisma.document.findUnique({
      where: { linkId },
    });

    if (!doc || doc.isRevoked) {
      return NextResponse.json({ error: "Document révoqué" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Navigateur Web";

    // Find recent ViewLog in last 10 minutes or create new log session
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    let viewLog = await prisma.viewLog.findFirst({
      where: {
        documentId: doc.id,
        recipientIp: ip,
        createdAt: { gte: tenMinsAgo },
      },
    });

    if (!viewLog) {
      viewLog = await prisma.viewLog.create({
        data: {
          documentId: doc.id,
          recipientIp: ip,
          userAgent,
          totalDurationSeconds: durationSeconds,
        },
      });
    } else {
      viewLog = await prisma.viewLog.update({
        where: { id: viewLog.id },
        data: {
          totalDurationSeconds: { increment: durationSeconds },
        },
      });
    }

    // Upsert PageAnalytics
    const existingPageStat = await prisma.pageAnalytics.findFirst({
      where: {
        viewLogId: viewLog.id,
        pageNumber,
      },
    });

    if (existingPageStat) {
      await prisma.pageAnalytics.update({
        where: { id: existingPageStat.id },
        data: {
          durationSeconds: { increment: durationSeconds },
        },
      });
    } else {
      await prisma.pageAnalytics.create({
        data: {
          viewLogId: viewLog.id,
          pageNumber,
          durationSeconds,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de suivi" }, { status: 500 });
  }
}

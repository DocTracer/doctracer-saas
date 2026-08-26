import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

// Helper to generate a clean PDF if no file was uploaded
async function createSamplePdf(title: string, recipient: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(title, { x: 50, y: 730, size: 22, font, color: rgb(0.1, 0.2, 0.4) });
  page.drawText(`Document confidentiel préparé pour : ${recipient}`, { x: 50, y: 690, size: 12, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  page.drawText("PROPOSITION COMMERCIALE & DEVIS", { x: 50, y: 640, size: 14, font });
  page.drawText("1. Prestation de conseil & audit technique ................. 2 500 €", { x: 50, y: 600, size: 12, font: fontRegular });
  page.drawText("2. Déploiement & Intégration sur-mesure ...................... 4 000 €", { x: 50, y: 570, size: 12, font: fontRegular });
  page.drawText("3. Accompagnement & Maintenance annuelle .................. 1 500 €", { x: 50, y: 540, size: 12, font: fontRegular });

  page.drawText("TOTAL ESTIMÉ HT : 8 000 €", { x: 50, y: 480, size: 16, font, color: rgb(0.8, 0.2, 0.2) });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const linkId = searchParams.get("linkId");

  try {
    if (id) {
      const doc = await prisma.document.findUnique({
        where: { id },
        include: {
          viewLogs: {
            include: { pageAnalytics: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      return NextResponse.json({ document: doc });
    }

    if (linkId) {
      const doc = await prisma.document.findUnique({
        where: { linkId },
      });
      return NextResponse.json({ document: doc });
    }

    const docs = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { viewLogs: true } },
      },
    });

    const formatted = docs.map((d) => ({
      ...d,
      viewsCount: d._count.viewLogs,
    }));

    return NextResponse.json({ documents: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = (formData.get("title") as string) || "Document Sans Titre";
    const recipientEmail = (formData.get("recipientEmail") as string) || "client@exemple.com";
    const customWatermark = (formData.get("customWatermark") as string) || recipientEmail;
    const allowDownload = formData.get("allowDownload") === "true";
    const file = formData.get("file") as File | null;

    const linkId = Math.random().toString(36).substring(2, 10);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${linkId}.pdf`;
    const filePath = path.join(uploadsDir, filename);

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(bytes));
    } else {
      const samplePdfBuffer = await createSamplePdf(title, recipientEmail);
      fs.writeFileSync(filePath, samplePdfBuffer);
    }

    const newDoc = await prisma.document.create({
      data: {
        title,
        recipientEmail,
        customWatermark,
        allowDownload,
        linkId,
        filePath: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création du document" }, { status: 500 });
  }
}

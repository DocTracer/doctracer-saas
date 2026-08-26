import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { addWatermarkToPdf } from "@/lib/pdf-watermark";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { linkId: string } }
) {
  const { linkId } = params;

  try {
    const doc = await prisma.document.findUnique({
      where: { linkId },
    });

    if (!doc || doc.isRevoked) {
      return new NextResponse("Accès révoqué ou document introuvable", { status: 403 });
    }

    const fullFilePath = path.join(process.cwd(), "public", doc.filePath);
    if (!fs.existsSync(fullFilePath)) {
      return new NextResponse("Fichier PDF source introuvable", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullFilePath);
    const watermarkText = doc.customWatermark || doc.recipientEmail;

return new Response(Buffer.from(watermarkedPdfBytes) as unknown as BodyInit, {
  const watermarkedPdfBytes = await addWatermarkToPdf(fileBuffer, watermarkText);

    return new Response(Buffer.from(watermarkedPdfBytes) as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": doc.allowDownload
          ? `inline; filename="${doc.title}.pdf"`
          : `inline; filename="secured-document.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Erreur lors de la génération du PDF", { status: 500 });
  }
}

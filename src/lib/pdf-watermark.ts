import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export async function addWatermarkToPdf(
  pdfBuffer: Buffer | Uint8Array,
  watermarkText: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Draw main diagonal watermark in center
    const fontSize = Math.min(width, height) / 18;
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2 - textHeight / 2,
      size: fontSize,
      font: font,
      color: rgb(0.7, 0.1, 0.1),
      opacity: 0.28,
      rotate: degrees(35),
    });

    // Draw top header banner
    const headerText = `CONFIDENTIEL - Document sécurisé par DocTracer pour : ${watermarkText}`;
    const headerFontSize = 9;
    const headerWidth = font.widthOfTextAtSize(headerText, headerFontSize);

    page.drawText(headerText, {
      x: width / 2 - headerWidth / 2,
      y: height - 20,
      size: headerFontSize,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
      opacity: 0.6,
    });
  }

  return await pdfDoc.save();
}

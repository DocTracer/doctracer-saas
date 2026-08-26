import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, isRevoked } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    const updatedDoc = await prisma.document.update({
      where: { id },
      data: { isRevoked },
    });

    return NextResponse.json({ success: true, document: updatedDoc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }
}

import { Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

function normalizeLanguage(lang: string): Language | null {
  switch (lang.toLowerCase()) {
    case "en":
      return Language.EN;
    case "pt-br":
      return Language.PT_BR;
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { language } = await request.json();

    const normalizedLanguage = normalizeLanguage(language);

    if (normalizedLanguage === null) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { language: normalizedLanguage, updated_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving language:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import { sendResetPasswordEmail } from "@/actions/send-email-reset-password";
import prisma from "@/prisma/client";

const translations = {
  pt: {
    emailNotProvided: "Email não fornecido",
    organizationNotFound: "Organização não encontrada",
    emailNotFound: "Email não encontrado para esta organização",
    internalError: "Erro interno do servidor",
  },
  en: {
    emailNotProvided: "Email not provided",
    organizationNotFound: "Organization not found",
    emailNotFound: "Email not found for this organization",
    internalError: "Internal Server Error",
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { email } = await request.json();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const t =
      translations[locale as keyof typeof translations] || translations.pt;

    if (!email) {
      return NextResponse.json(
        { success: false, error: t.emailNotProvided },
        { status: 400 }
      );
    }

    const organization = await prisma.organizations.findFirst({
      where: { slug: slug },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: t.organizationNotFound },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
        organization_id: organization.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: t.emailNotFound },
        { status: 400 }
      );
    }

    const result = await sendResetPasswordEmail(
      email,
      locale,
      organization,
      slug
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset instructions have been sent to your email.",
    });
  } catch (error) {
    console.error("Error in forgot-password API:", error);
    return NextResponse.json(
      { success: false, error: translations.pt.internalError },
      { status: 500 }
    );
  }
}

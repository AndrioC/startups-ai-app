import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "@/actions/send-email-confirmation-account";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("token");
  const locale = searchParams.get("locale") || "pt";
  const subdomain = searchParams.get("subdomain");

  if (!token || !subdomain) {
    return NextResponse.json(
      { success: false, error: "Token or subdomain not found" },
      { status: 400 }
    );
  }

  try {
    const result = await verifyToken(token, locale);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const { email } = result;

    const organization = await prisma.organizations.findFirst({
      where: { slug: subdomain },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    const organizationId = Number(organization.id);
    const updatedUser = await prisma.user.update({
      where: {
        email_organization_id: {
          email: email!,
          organization_id: Number(organizationId),
        },
      },
      data: {
        email_verified: new Date(),
      },
    });

    await prisma.user_organizations.create({
      data: {
        user_id: updatedUser.id,
        organization_id: Number(organizationId),
        joined_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verificado com sucesso",
      email,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import { resetPassword } from "@/actions/send-email-reset-password";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, slug } = await request.json();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";

    if (!token || !newPassword || !slug) {
      return NextResponse.json(
        { success: false, error: "Token, new password, or slug not found" },
        { status: 400 }
      );
    }

    const organization = await prisma.organizations.findFirst({
      where: { slug },
    });

    if (!organization) {
      return NextResponse.json(
        { success: false, error: "Organization not found" },
        { status: 400 }
      );
    }

    const result = await resetPassword(
      token,
      newPassword,
      locale,
      organization.id
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Error in reset-password API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { UserType } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export async function POST() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { organizations: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        name: user.name,
        email: user.email,
        organization_id: user.organization_id,
        type: user.type,
        user_logo_img: user.logo_img
          ? `https://${process.env.S3_USERS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${user.logo_img}`
          : null,
        isSAI: user.type === UserType.SAI,
        isAdmin: user.type === UserType.ADMIN,
        isInvestor: user.type === UserType.INVESTOR,
        isMentor: user.type === UserType.MENTOR,
        isStartup: user.type === UserType.STARTUP,
        isEnterprise: user.type === UserType.ENTERPRISE,
        logo_img: user.organizations?.logo_img
          ? `https://${process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${user.organizations.logo_img}`
          : null,
        logo_sidebar: user.organizations?.logo_sidebar
          ? `https://${process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${user.organizations.logo_sidebar}`
          : null,
        language: user.language,
      },
    };

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { message: "Error refreshing session" },
      { status: 500 }
    );
  }
}

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
        isSGL: user.type === "SGL",
        isAdmin: user.type === "ADMIN",
        isInvestor: user.type === "INVESTOR",
        isMentor: user.type === "MENTOR",
        isStartup: user.type === "STARTUP",
        logo_img: user.organizations?.logo_img
          ? `https://${process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${user.organizations.logo_img}`
          : null,
        logo_sidebar: user.organizations?.logo_sidebar
          ? `https://${process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${user.organizations.logo_sidebar}`
          : null,
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

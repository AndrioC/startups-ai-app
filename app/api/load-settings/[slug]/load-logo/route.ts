import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME = process.env
  .S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string;

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!params.slug || typeof params.slug !== "string") {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const organization = await prisma.organizations.findFirst({
      where: { slug: params.slug },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const logoImgUrl = organization?.logo_img
      ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${organization?.logo_img}`
      : null;

    return NextResponse.json({ logoImgUrl }, { status: 201 });
  } catch (error) {
    console.error("Error fetching organization logo:", error);
    return NextResponse.json(
      { error: "Error fetching organization logo" },
      { status: 500 }
    );
  }
}

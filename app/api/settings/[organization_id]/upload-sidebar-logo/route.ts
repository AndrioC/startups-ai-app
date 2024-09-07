import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import prisma from "@/prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME =
  process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME;

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 2MB limit" },
        { status: 400 }
      );
    }

    const organization = await prisma.organizations.findUnique({
      where: { id: Number(params.organization_id) },
      select: { logo_sidebar: true },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileNameWithoutExtension = path.parse(file.name).name;
    const fileName = await uploadFileToS3(
      buffer,
      fileNameWithoutExtension,
      S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string,
      "image"
    );

    await prisma.organizations.update({
      where: { id: Number(params.organization_id) },
      data: { logo_sidebar: fileName },
    });

    if (organization?.logo_sidebar) {
      try {
        await deleteFileFromS3(
          organization.logo_sidebar,
          S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string
        );
      } catch (deleteError) {
        console.error("Error deleting previous sidebar logo:", deleteError);
      }
    }

    return NextResponse.json({ fileName }, { status: 200 });
  } catch (error) {
    console.error("Error uploading sidebar logo:", error);
    return NextResponse.json(
      { error: "Error uploading file or updating organization" },
      { status: 500 }
    );
  }
}

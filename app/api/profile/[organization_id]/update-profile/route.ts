import { Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import prisma from "@/prisma/client";

const S3_USERS_IMGS_BUCKET_NAME = process.env.S3_USERS_IMGS_BUCKET_NAME;

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const language = formData.get("language") as Language | null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!language) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(user_id) },
      select: { logo_img: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let fileName = user.logo_img;

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File size exceeds 2MB limit" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileNameWithoutExtension = path.parse(file.name).name;
      fileName = await uploadFileToS3(
        buffer,
        fileNameWithoutExtension,
        S3_USERS_IMGS_BUCKET_NAME as string,
        "image"
      );

      if (user.logo_img) {
        try {
          await deleteFileFromS3(
            user.logo_img,
            S3_USERS_IMGS_BUCKET_NAME as string
          );
        } catch (deleteError) {
          console.error("Error deleting previous logo:", deleteError);
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(user_id) },
      data: {
        name: name,
        logo_img: fileName,
        language: language,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        name: updatedUser.name,
        user_logo_img: updatedUser.logo_img,
        language: updatedUser.language,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Error updating user profile" },
      { status: 500 }
    );
  }
}

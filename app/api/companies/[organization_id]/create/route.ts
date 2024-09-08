import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import { CompanySchema } from "@/lib/schemas/schema-companies";
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

  const uploadedFiles: { key: string; prefix: string }[] = [];

  try {
    const formData = await request.formData();

    const isPaying = formData.get("isPaying") === "true";

    let users = [];
    const usersString = formData.get("users");
    if (typeof usersString === "string") {
      users = JSON.parse(usersString);
    }

    const parsedData = {
      ...Object.fromEntries(formData),
      isPaying,
      users,
    };

    const companyData = CompanySchema().parse(parsedData);

    const logo = formData.get("logo") as File | null;
    const logoSidebar = formData.get("logoSidebar") as File | null;

    let logoFileName: string | null = null;
    let logoSidebarFileName: string | null = null;

    if (logo) {
      logoFileName = await handleFileUpload(logo, "logo");
      uploadedFiles.push({ key: logoFileName, prefix: "logo" });
    }

    if (logoSidebar) {
      logoSidebarFileName = await handleFileUpload(logoSidebar, "logoSidebar");
      uploadedFiles.push({ key: logoSidebarFileName, prefix: "logoSidebar" });
    }

    const result = await prisma.$transaction(async (prismaClient) => {
      const company = await prismaClient.organizations.create({
        data: {
          name: companyData.companyName,
          created_at: companyData.createdAt,
          payment_needed: companyData.isPaying,
          logo_img: logoFileName,
          logo_sidebar: logoSidebarFileName,
        },
      });

      if (companyData.users && companyData.users.length > 0) {
        await prismaClient.user.createMany({
          data: companyData.users.map((user) => ({
            ...user,
            organization_id: Number(company.id),
            type: UserType.ADMIN,
          })),
        });
      }

      return company;
    });

    return NextResponse.json({ company: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);

    for (const file of uploadedFiles) {
      try {
        await deleteFileFromS3(
          file.key,
          S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string
        );
      } catch (deleteError) {
        console.error(`Error deleting file ${file.key}:`, deleteError);
      }
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Error creating company" },
      { status: 500 }
    );
  }
}

const handleFileUpload = async (
  file: File,
  prefix: string
): Promise<string> => {
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File size exceeds 2MB limit");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileNameWithoutExtension = path.parse(file.name).name;
  return await uploadFileToS3(
    buffer,
    `${prefix}_${fileNameWithoutExtension}`,
    S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string,
    "image"
  );
};

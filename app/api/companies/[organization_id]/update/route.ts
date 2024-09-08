import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { z } from "zod";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import { CompanySchema } from "@/lib/schemas/schema-companies";
import prisma from "@/prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME =
  process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const companyId = Number(url.searchParams.get("companyId"));

  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  if (!companyId || isNaN(companyId)) {
    return NextResponse.json(
      { error: "Valid Company ID is required" },
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

    const existingCompany = await prisma.organizations.findUnique({
      where: { id: companyId },
      select: { logo_img: true, logo_sidebar: true },
    });

    if (!existingCompany) {
      throw new Error("Company not found");
    }

    const result = await prisma.$transaction(async (prismaClient) => {
      const updatedCompany = await prismaClient.organizations.update({
        where: { id: companyId },
        data: {
          name: companyData.companyName,
          created_at: companyData.createdAt,
          payment_needed: companyData.isPaying,
          logo_img: logoFileName || undefined,
          logo_sidebar: logoSidebarFileName || undefined,
          updated_at: new Date(),
        },
      });

      if (logoFileName && existingCompany.logo_img) {
        await deleteFileFromS3(
          existingCompany.logo_img,
          S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string
        );
      }

      if (logoSidebarFileName && existingCompany.logo_sidebar) {
        await deleteFileFromS3(
          existingCompany.logo_sidebar,
          S3_ORGANIZATIONS_IMGS_BUCKET_NAME as string
        );
      }

      await prismaClient.user.deleteMany({
        where: { organization_id: companyId },
      });

      if (companyData.users && companyData.users.length > 0) {
        await prismaClient.user.createMany({
          data: companyData.users.map((user) => ({
            ...user,
            organization_id: Number(companyId),
            type: UserType.ADMIN,
          })),
        });
      }

      return updatedCompany;
    });

    return NextResponse.json({ company: result }, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);

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
      { error: "Error updating company" },
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

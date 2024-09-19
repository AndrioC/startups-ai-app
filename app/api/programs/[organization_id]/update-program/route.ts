import { NextRequest, NextResponse } from "next/server";

import { deleteFileFromS3, uploadFileToS3 } from "@/actions/upload-s3";
import prisma from "@/prisma/client";

const S3_PROGRAMS_EDITAL_FILES = process.env.S3_PROGRAMS_EDITAL_FILES;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const programId = Number(url.searchParams.get("programId"));

  const formData = await request.formData();
  const jsonData = JSON.parse(formData.get("json") as string);

  const {
    programName,
    startDate,
    endDate,
    userId,
    description,
    isPublished,
    removeExistingFile,
  } = jsonData;

  let editalFileUrl = null;

  const editalFile = formData.get("editalFile") as File | null;

  if (editalFile) {
    const buffer = Buffer.from(await editalFile.arrayBuffer());
    const uploadedFileName = await uploadFileToS3(
      buffer,
      editalFile.name,
      S3_PROGRAMS_EDITAL_FILES as string,
      "file"
    );
    editalFileUrl = uploadedFileName;
  } else if (!editalFile && removeExistingFile) {
    const existingProgram = await prisma.programs.findUnique({
      where: { id: programId },
    });

    if (existingProgram?.edital_file) {
      await deleteFileFromS3(
        existingProgram.edital_file,
        S3_PROGRAMS_EDITAL_FILES as string
      );
    }
    editalFileUrl = null;
  } else {
    const existingProgram = await prisma.programs.findUnique({
      where: { id: programId },
    });
    editalFileUrl = existingProgram?.edital_file || null;
  }

  await prisma.programs.update({
    where: { id: Number(programId) },
    data: {
      organization_id: Number(params.organization_id),
      program_name: programName,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      created_by_id: Number(userId),
      description: description,
      is_published: isPublished,
      edital_file: editalFileUrl,
    },
  });

  return NextResponse.json({}, { status: 200 });
}

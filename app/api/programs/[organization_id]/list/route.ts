import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_PROGRAMS_EDITAL_FILES = process.env.S3_PROGRAMS_EDITAL_FILES;

export interface ProgramTable {
  id: number;
  programName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  editalFile?: File;
  editalFileUrl: string | null;
  isPublished: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page"));
  const pageSize = Number(url.searchParams.get("pageSize"));
  const programName = url.searchParams.get("programName");
  const programStartDate = url.searchParams.get("programStartDate");
  const programEndDate = url.searchParams.get("programEndDate");

  const where: any = {
    organization_id: Number(params.organization_id),
  };

  if (programName) {
    where.program_name = {
      contains: programName,
      mode: "insensitive",
    };
  }

  if (programStartDate !== undefined && programStartDate !== null) {
    const parsedStartDate = new Date(programStartDate);
    if (!isNaN(parsedStartDate.getTime())) {
      where.start_date = parsedStartDate;
    }
  }

  if (programEndDate !== undefined && programEndDate !== null) {
    const parsedEndDate = new Date(programEndDate);
    if (!isNaN(parsedEndDate.getTime())) {
      where.end_date = parsedEndDate;
    }
  }

  const programs = await prisma.programs.findMany({
    where,
    orderBy: { program_name: "asc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const programsCount = await prisma.programs.count({
    where: { organization_id: Number(params.organization_id) },
  });

  const programTable: ProgramTable[] = programs.map((value) => {
    return {
      id: value.id,
      programName: value.program_name,
      startDate: value.start_date,
      endDate: value.end_date,
      description: value.description!,
      editalFileUrl: value.edital_file
        ? `https://${S3_PROGRAMS_EDITAL_FILES}.s3.amazonaws.com/${value.edital_file}`
        : null,
      isPublished: value.is_published!,
    };
  });

  return NextResponse.json({ programTable, programsCount }, { status: 201 });
}

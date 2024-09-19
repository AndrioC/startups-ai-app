import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

const S3_PROGRAMS_EDITAL_FILES = process.env.S3_PROGRAMS_EDITAL_FILES;

export interface ProgramTable {
  id: number;
  programName: string;
  startDate: Date;
  endDate: Date;
  description: string;
  editalFileUrl: string | null;
  isPublished: boolean;
  organization: {
    id: number;
    name: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.organization_id) {
      return NextResponse.json(
        { error: "Invalid organization ID" },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    const currentDate = new Date();

    const where: any = {
      OR: [
        { organization_id: Number(params.organization_id) },
        { is_published: true },
      ],
      is_deleted: false,
      is_paused: false,
      end_date: {
        gt: currentDate,
      },
    };

    const programs = await prisma.programs.findMany({
      where,
      select: {
        id: true,
        program_name: true,
        start_date: true,
        end_date: true,
        description: true,
        edital_file: true,
        is_published: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { start_date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const programsCount = await prisma.programs.count({ where });

    const programTable: ProgramTable[] = programs.map((value) => ({
      id: value.id,
      programName: value.program_name,
      startDate: value.start_date,
      endDate: value.end_date,
      description: value.description ?? "",
      editalFileUrl: value.edital_file
        ? `https://${S3_PROGRAMS_EDITAL_FILES}.s3.amazonaws.com/${value.edital_file}`
        : null,
      isPublished: value.is_published ?? false,
      organization: value.organization,
    }));

    return NextResponse.json({ programTable, programsCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

import { ProgramTable } from "../list/route";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  // const session = await getServerSession(authOptions);

  // if (!session) return NextResponse.json({}, { status: 401 });

  const url = new URL(request.url);
  const programId = Number(url.searchParams.get("programId"));

  const body = (await request.json()) as ProgramTable;

  const { programName, startDate, endDate } = body;

  await prisma.programs.update({
    where: { id: Number(programId) },
    data: {
      program_name: programName,
      start_date: startDate,
      end_date: endDate,
    },
  });

  return NextResponse.json({}, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ProgramSchema } from "@/lib/schemas/schema-programs";
import prisma from "@/prisma/client";

const formSchema = ProgramSchema();

interface DataRequest extends z.infer<typeof formSchema> {
  userId: number;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const data = (await request.json()) as DataRequest;

  await prisma.$transaction(async (prisma) => {
    await prisma.programs.create({
      data: {
        organization_id: Number(params.organization_id),
        program_name: data.programName,
        start_date: data.startDate,
        end_date: data.endDate,
        created_by_id: Number(data.userId),
      },
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating program: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

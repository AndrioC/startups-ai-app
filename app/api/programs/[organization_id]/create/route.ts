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
    const program = await prisma.programs.create({
      data: {
        organization_id: Number(params.organization_id),
        program_name: data.programName,
        start_date: data.startDate,
        end_date: data.endDate,
        created_by_id: Number(data.userId),
      },
    });

    const randomColor = getRandomColor();
    await prisma.kanbans.create({
      data: {
        program_id: program.id,
        created_by_id: Number(data.userId),
        color: randomColor,
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

function getRandomColor(): string {
  const colorList = [
    "#043565",
    "#EB4B98",
    "#462255",
    "#DEB841",
    "#DD1C1A",
    "#F0C808",
    "#086788",
    "#A53860",
    "#5C7AFF",
    "#E0FF4F",
    "#DB162F",
    "#5B2A86",
    "#C32F27",
    "#FF1654",
    "#F0F0C9",
    "#88D9E6",
    "#FF715B",
    "#1D3461",
    "#6184D8",
    "#2A4494",
  ];

  return colorList[Math.floor(Math.random() * colorList.length)];
}

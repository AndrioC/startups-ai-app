import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { uploadFileToS3 } from "@/actions/upload-s3";
import { ProgramSchema } from "@/lib/schemas/schema-programs";
import prisma from "@/prisma/client";

const S3_PROGRAMS_EDITAL_FILES = process.env.S3_PROGRAMS_EDITAL_FILES;

const formSchema = ProgramSchema();

interface DataRequest extends z.infer<typeof formSchema> {
  userId: number;
  editalFile?: File;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const data = await request.formData();
  const jsonData = JSON.parse(data.get("json") as string) as DataRequest;
  const editalFile = data.get("editalFile") as File | null;

  await prisma.$transaction(async (prisma) => {
    const program = await prisma.programs.create({
      data: {
        organization_id: Number(params.organization_id),
        program_name: jsonData.programName,
        start_date: jsonData.startDate,
        end_date: jsonData.endDate,
        created_by_id: Number(jsonData.userId),
        description: jsonData.description,
        is_published: jsonData.isPublished,
      },
    });

    const randomColor = getRandomColor();
    await prisma.kanbans.create({
      data: {
        program_id: program.id,
        created_by_id: Number(jsonData.userId),
        color: randomColor,
      },
    });

    if (editalFile) {
      const fileBuffer = await editalFile.arrayBuffer();
      const fileName = await uploadFileToS3(
        Buffer.from(fileBuffer),
        editalFile.name,
        S3_PROGRAMS_EDITAL_FILES as string,
        "file"
      );

      await prisma.programs.update({
        where: { id: program.id },
        data: { edital_file: fileName },
      });
    }
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

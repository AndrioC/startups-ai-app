import { kanbans } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  program_token: string;
  user_id: number;
  name: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const data = (await request.json()) as DataRequest;

  await prisma.$transaction(async (prisma) => {
    const lastKanban: kanbans[] = await prisma.$queryRaw`
      SELECT
        id,
        program_id,
        position_value
      FROM
        kanbans
      WHERE
        encode(digest(CAST(program_id AS text), 'sha1'), 'hex') = ${data.program_token}
      ORDER BY id DESC
      LIMIT 1;
  `;

    const position = lastKanban ? lastKanban[0].position_value + 1 : 0;
    const randomColor = getRandomColor();
    await prisma.kanbans.create({
      data: {
        program_id: Number(lastKanban[0].program_id),
        created_by_id: Number(data.user_id),
        kanban_name: data.name,
        position_value: position,
        color: randomColor,
      },
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating kanban: ", error);
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

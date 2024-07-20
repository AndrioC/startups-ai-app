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

  console.log("CREATING", data);

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
    await prisma.kanbans.create({
      data: {
        program_id: Number(lastKanban[0].program_id),
        created_by_id: Number(data.user_id),
        kanban_name: data.name,
        position_value: position,
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

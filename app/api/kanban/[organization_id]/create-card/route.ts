import { kanbans } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  kanban_id: number;
  title: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const data = (await request.json()) as DataRequest;

  await prisma.$transaction(async (prisma) => {
    const lastKanbanCard = await prisma.kanban_cards.findFirst({
      where: {
        kanban_id: Number(data.kanban_id),
      },
      orderBy: {
        id: "desc",
      },
    });

    const position = lastKanbanCard ? lastKanbanCard.position_value + 1 : 0;
    await prisma.kanban_cards.create({
      data: {
        title: data.title,
        kanban_id: Number(data.kanban_id),
        position_value: position,
      },
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating kanban-card: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

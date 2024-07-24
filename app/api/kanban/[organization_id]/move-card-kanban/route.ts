import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  kanban_card_id: number;
  old_kanban_id: number;
  new_kanban_id: number;
  new_position: number;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const data = (await request.json()) as DataRequest;

  const existingCard = await prisma.kanban_cards.findUnique({
    where: { id: data.kanban_card_id },
  });

  if (!existingCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  await prisma.$transaction(async (prisma) => {
    if (data.old_kanban_id === data.new_kanban_id) {
      // mesmo kanban
      const cards = await prisma.kanban_cards.findMany({
        where: { kanban_id: data.old_kanban_id },
        orderBy: { position_value: "asc" },
      });

      const updatedCards = cards.filter(
        (card) => card.id !== data.kanban_card_id
      );
      updatedCards.splice(data.new_position, 0, existingCard!);

      for (let i = 0; i < updatedCards.length; i++) {
        await prisma.kanban_cards.update({
          where: { id: updatedCards[i].id },
          data: { position_value: i },
        });
      }
    } else {
      // Mover de um kanban para outro
      const sourceCards = await prisma.kanban_cards.findMany({
        where: { kanban_id: data.old_kanban_id },
        orderBy: { position_value: "asc" },
      });

      const destinationCards = await prisma.kanban_cards.findMany({
        where: { kanban_id: data.new_kanban_id },
        orderBy: { position_value: "asc" },
      });

      const updatedSourceCards = sourceCards.filter(
        (card) => card.id !== data.kanban_card_id
      );
      for (let i = 0; i < updatedSourceCards.length; i++) {
        await prisma.kanban_cards.update({
          where: { id: updatedSourceCards[i].id },
          data: { position_value: i },
        });
      }

      const updatedDestinationCards = [...destinationCards];
      updatedDestinationCards.splice(data.new_position, 0, existingCard);

      for (let i = 0; i < updatedDestinationCards.length; i++) {
        await prisma.kanban_cards.update({
          where: { id: updatedDestinationCards[i].id },
          data: {
            kanban_id: data.new_kanban_id,
            position_value: i,
          },
        });
      }

      await prisma.kanban_cards.update({
        where: { id: data.kanban_card_id },
        data: {
          kanban_id: data.new_kanban_id,
          position_value: data.new_position,
        },
      });
    }
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating kanban-card: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

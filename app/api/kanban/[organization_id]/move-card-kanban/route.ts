import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  kanban_card_id: number;
  old_kanban_id: number;
  new_kanban_id: number;
  new_position: number;
}

interface KanbanCard {
  id: number;
  kanban_id: number;
  startup_id: number;
  position_value: number;
  created_at: Date;
  updated_at: Date;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
): Promise<NextResponse> {
  const data = (await request.json()) as DataRequest;

  const existingCard = await prisma.kanban_cards.findUnique({
    where: { id: data.kanban_card_id },
  });

  if (!existingCard) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      if (data.old_kanban_id === data.new_kanban_id) {
        await updateCardsInSameKanban(prisma, data, existingCard);
      } else {
        await moveCardBetweenKanbans(prisma, data, existingCard);
      }
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error("Error updating kanban card: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function updateCardsInSameKanban(
  prisma: Prisma.TransactionClient,
  data: DataRequest,
  existingCard: KanbanCard
): Promise<void> {
  const cards = await prisma.kanban_cards.findMany({
    where: { kanban_id: data.old_kanban_id },
    orderBy: { position_value: "asc" },
  });

  const updatedCards = cards.filter(
    (card: KanbanCard) => card.id !== data.kanban_card_id
  );
  updatedCards.splice(data.new_position, 0, existingCard);

  await updateCardPositions(prisma, updatedCards);
}

async function moveCardBetweenKanbans(
  prisma: Prisma.TransactionClient,
  data: DataRequest,
  existingCard: KanbanCard
): Promise<void> {
  const sourceCards = await prisma.kanban_cards.findMany({
    where: { kanban_id: data.old_kanban_id },
    orderBy: { position_value: "asc" },
  });

  const destinationCards = await prisma.kanban_cards.findMany({
    where: { kanban_id: data.new_kanban_id },
    orderBy: { position_value: "asc" },
  });

  const updatedSourceCards = sourceCards.filter(
    (card: KanbanCard) => card.id !== data.kanban_card_id
  );

  await updateCardPositions(prisma, updatedSourceCards);

  const updatedDestinationCards = [...destinationCards];
  updatedDestinationCards.splice(data.new_position, 0, existingCard);

  await updateCardPositions(
    prisma,
    updatedDestinationCards,
    data.new_kanban_id
  );

  await prisma.kanban_cards.update({
    where: { id: data.kanban_card_id },
    data: {
      kanban_id: data.new_kanban_id,
      position_value: data.new_position,
    },
  });
}

async function updateCardPositions(
  prisma: Prisma.TransactionClient,
  cards: KanbanCard[],
  newKanbanId?: number
): Promise<void> {
  for (let i = 0; i < cards.length; i++) {
    await prisma.kanban_cards.update({
      where: { id: cards[i].id },
      data: {
        position_value: i,
        ...(newKanbanId && { kanban_id: newKanbanId }),
      },
    });
  }
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startup_id, program_id } = body;

    if (!startup_id || !program_id) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const currentDate = new Date();

    const result = await prisma.$transaction(async (prisma) => {
      const program = await prisma.programs.findUnique({
        where: { id: Number(program_id) },
        select: { organization_id: true },
      });

      if (!program) {
        throw new Error("Program not found");
      }

      const existingRelation = await prisma.startup_organizations.findFirst({
        where: {
          startup_id: Number(startup_id),
          organization_id: program.organization_id,
        },
      });

      let newOrganizationRelation = null;
      if (!existingRelation) {
        newOrganizationRelation = await prisma.startup_organizations.create({
          data: {
            startup_id: Number(startup_id),
            organization_id: program.organization_id,
            created_at: currentDate,
          },
        });
      }

      const newStartupProgram = await prisma.startup_programs.create({
        data: {
          startup_id: Number(startup_id),
          program_id: Number(program_id),
          joined_at: currentDate,
        },
      });

      const kanban = await prisma.kanbans.findFirst({
        where: {
          program_id: Number(program_id),
          is_deleted: false,
        },
        orderBy: {
          created_at: "asc",
        },
      });

      if (!kanban) {
        throw new Error("No kanban found for the given program");
      }

      const cardCount = await prisma.kanban_cards.count({
        where: {
          kanban_id: kanban.id,
        },
      });

      const newKanbanCard = await prisma.kanban_cards.create({
        data: {
          kanban_id: kanban.id,
          startup_id: Number(startup_id),
          position_value: cardCount,
        },
      });

      return { newStartupProgram, newKanbanCard, newOrganizationRelation };
    });

    return NextResponse.json({
      status: 200,
      data: {
        startup_program: result.newStartupProgram,
        kanban_card: result.newKanbanCard,
        organization_relation: result.newOrganizationRelation,
      },
      message: result.newOrganizationRelation
        ? "Startup added to program, kanban, and related to organization successfully!"
        : "Startup added to program and kanban successfully!",
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

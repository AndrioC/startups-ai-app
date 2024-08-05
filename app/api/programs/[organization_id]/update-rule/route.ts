import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  program_id: number;
  kanban_id: number;
  rules: {
    key: string;
    rule: string;
    comparationType: string;
    field_type: string;
    value: string[];
  }[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  try {
    const data = (await request.json()) as DataRequest;

    await prisma.$transaction(async (tx) => {
      await tx.rule.deleteMany({
        where: {
          kanban_id: data.kanban_id,
        },
      });

      for (const rule of data.rules) {
        await tx.rule.create({
          data: {
            key: rule.key,
            options: rule.value,
            comparation_type: JSON.stringify([{ key: rule.comparationType }]),
            rule: rule.rule,
            field_type: rule.field_type,
            program_id: data.program_id,
            kanban_id: data.kanban_id,
          },
        });
      }
    });

    return NextResponse.json(
      { message: "Regras atualizadas com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Erro ao atualizar regras: ", error);
    return NextResponse.json(
      { error: "Erro ao atualizar regras" },
      { status: 500 }
    );
  }
}

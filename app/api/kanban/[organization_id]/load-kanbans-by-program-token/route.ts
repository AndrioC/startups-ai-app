import { programs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import prisma from "@/prisma/client";

import { auth } from "../../../../../auth";

export interface KanbanDataWithCards {
  id: number;
  kanban_name: string;
  kanban_position: number;
  kanban_cards: {
    id: number;
    title: string;
    position_value: number;
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: number } }
) {
  const session = await auth();

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  console.log("token: ", token);

  const kanbanData: KanbanDataWithCards[] = await prisma.$queryRaw`
    SELECT
        k.id,
        k.kanban_name,
        k.position_value AS kanban_position,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', kc.id,
                    'title', kc.title,
                    'position_value', kc.position_value
                )
            ) FILTER (WHERE kc.id IS NOT NULL), '[]'
        ) AS kanban_cards
    FROM
        kanbans k
    LEFT JOIN
        kanban_cards kc ON k.id = kc.kanban_id
    WHERE
        encode(digest(CAST(k.program_id AS text), 'sha1'), 'hex') = ${token}
    GROUP BY
        k.id;
  `;

  console.log("kanbanData: ", kanbanData);

  return NextResponse.json(kanbanData, { status: 201 });
}

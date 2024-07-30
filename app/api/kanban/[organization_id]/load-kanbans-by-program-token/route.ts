import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

export interface KanbanDataWithCards {
  id: number;
  kanban_name: string;
  kanban_position: number;
  kanban_cards: {
    id: number;
    position_value: number;
    startup: {
      id: number;
      name: string;
    };
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: number } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const kanbanData: KanbanDataWithCards[] = await prisma.$queryRaw`
      SELECT
          k.id,
          k.kanban_name,
          k.position_value AS kanban_position,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', kc.id,
                      'position_value', kc.position_value,
                      'startup', json_build_object(
                          'id', s.id,
                          'name', s.name
                      )
                  )
              ) FILTER (WHERE kc.id IS NOT NULL), '[]'
          ) AS kanban_cards
      FROM
          kanbans k
      LEFT JOIN
          kanban_cards kc ON k.id = kc.kanban_id
      LEFT JOIN
          startups s ON kc.startup_id = s.id
      WHERE
          encode(digest(CAST(k.program_id AS text), 'sha1'), 'hex') = ${token}
      GROUP BY
          k.id;
    `;

    return NextResponse.json(kanbanData, { status: 200 });
  } catch (error) {
    console.error("Error fetching kanban data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

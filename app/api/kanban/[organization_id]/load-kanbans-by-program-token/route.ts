import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

interface ComparationType {
  key: "equal" | "greater_than" | "less_than";
  label_pt: string;
  label_en: string;
}

interface Option {
  value: string;
  label_pt: string;
  label_en: string;
}

interface RawRule {
  id: number;
  key: string;
  rule: string;
  comparation_type: string;
  field_type: string;
  options: string;
  program_id: number;
  kanban_id: number;
  move_to_kanban_id: number;
}

interface ProcessedRule {
  id: number;
  key: string;
  rule: string;
  comparation_type: ComparationType[];
  field_type: string;
  options: Option[] | null;
  program_id: number;
  kanban_id: number;
  move_to_kanban_id: number;
}

interface RawKanbanData {
  kanban_id: number;
  program_id: number;
  kanban_name: string;
  kanban_position: number;
  kanban_color: string;
  kanban_cards: {
    id: number;
    position_value: number;
    startup: {
      id: number;
      name: string;
      profile_filled_percentage: number;
      profile_updated: boolean;
    };
  }[];
  rules: RawRule[];
}

export interface KanbanDataWithCards {
  kanban_id: number;
  program_id: number;
  kanban_name: string;
  kanban_position: number;
  kanban_color: string;
  kanban_cards: {
    id: number;
    position_value: number;
    startup: {
      id: number;
      name: string;
      profile_filled_percentage: number;
      profile_updated: boolean;
    };
  }[];
  rules: ProcessedRule[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: number } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const kanbanData: RawKanbanData[] = await prisma.$queryRaw`
      SELECT
        k.id AS kanban_id,
        k.program_id,
        k.kanban_name,
        k.position_value AS kanban_position,
        k.color AS kanban_color,
        COALESCE(
          json_agg(
            json_build_object(
              'id', kc.id,
              'position_value', kc.position_value,
              'startup', json_build_object(
                  'id', s.id,
                  'name', s.name,
                  'profile_filled_percentage', s.profile_filled_percentage,
                  'profile_updated', s.profile_updated
              )
            )
          ) FILTER (WHERE kc.id IS NOT NULL AND s.name IS NOT NULL AND s.name != ''), '[]'
        ) AS kanban_cards,
        COALESCE(
            (SELECT 
                json_agg(
                    json_build_object(
                        'id', q.id,
                        'key', q.key,
                        'rule', q.rule,
                        'comparation_type', q.comparation_type,
                        'field_type', q.field_type,
                        'options', q.options,
                        'program_id', q.program_id,
                        'kanban_id', q.kanban_id,
                        'move_to_kanban_id', q.move_to_kanban_id
                    )
                )
            FROM rule q
            WHERE q.kanban_id = k.id
            ), '[]'
        ) AS rules
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

    const processedKanbanData: KanbanDataWithCards[] = kanbanData.map(
      (kanban) => ({
        ...kanban,
        rules: kanban.rules.map((rule: RawRule): ProcessedRule => {
          let processedComparationType: ComparationType[];
          let processedOptions: Option[] | null = null;

          try {
            processedComparationType = JSON.parse(rule.comparation_type);
          } catch (error) {
            console.error("Error parsing comparation_type:", error);
            processedComparationType = [];
          }

          if (
            rule.field_type === "multiple_select" ||
            rule.field_type === "single_select"
          ) {
            if (typeof rule.options === "string") {
              try {
                processedOptions = JSON.parse(rule.options);
              } catch (error) {
                if (rule.options === "[object Object]") {
                  console.warn(
                    'Options is "[object Object]", treating as empty array'
                  );
                  processedOptions = [];
                } else {
                  console.error("Error parsing options:", error);
                  processedOptions = null;
                }
              }
            } else if (Array.isArray(rule.options)) {
              processedOptions = rule.options;
            } else if (
              typeof rule.options === "object" &&
              rule.options !== null
            ) {
              processedOptions = [rule.options as Option];
            } else {
              console.warn("Unexpected options format, treating as null");
              processedOptions = null;
            }
          }

          return {
            ...rule,
            comparation_type: processedComparationType,
            options: processedOptions,
          };
        }),
      })
    );

    return NextResponse.json(processedKanbanData, { status: 200 });
  } catch (error) {
    console.error("Error fetching kanban data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_STARTUP_COUNTRY_FLAGS = process.env.S3_STARTUP_COUNTRY_FLAGS;

export interface StartupTable {
  id: number;
  name: string;
  vertical: string;
  country: string;
  business_model: string;
  business_model_code: string;
  operation_stage: string;
  country_flag: string;
  status: string;
  short_description: string;
  value_proposal: string;
  problem_that_is_solved: string;
  competitive_differentiator: string;
  last_twelve_months_revenue: string;
  is_approved: boolean;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page"));
  const pageSize = Number(url.searchParams.get("pageSize"));

  console.log("page", page);

  console.log("pageSize", pageSize);

  const startups = await prisma.startups.findMany({
    orderBy: [{ is_approved: "asc" }, { name: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      vertical: true,
      country: true,
      business_model: true,
      operation_stage: true,
    },
  });

  const startupTable: StartupTable[] = startups.map((value) => {
    return {
      id: value.id,
      name: value.name!,
      short_description:
        value.short_description_en ?? value.short_description_pt ?? "-",
      value_proposal: value.value_proposal_en ?? value.value_proposal_pt ?? "-",
      problem_that_is_solved:
        value.problem_that_is_solved_en ??
        value.problem_that_is_solved_pt ??
        "-",
      competitive_differentiator:
        value.competitive_differentiator_en ??
        value.competitive_differentiator_pt ??
        "-",
      vertical: extractFirstWordVertical(value.vertical?.name_en),
      country: value.country?.name_en ?? "-",
      business_model: value.business_model?.name ?? "-",
      business_model_code: value.business_model?.code ?? "-",
      operation_stage: extractFirstWordOperationStage(
        value.operation_stage?.name_en
      ),
      country_flag: `https://${S3_STARTUP_COUNTRY_FLAGS}.s3.amazonaws.com/${value.country?.code}.svg`,
      status: value.is_approved ? "approved" : "pending",
      last_twelve_months_revenue: value.last_twelve_months_revenue ?? "-",
      is_approved: value.is_approved,
    };
  });

  return NextResponse.json(startupTable, { status: 201 });
}

function extractFirstWordOperationStage(
  operation_stage: string | undefined
): string {
  if (operation_stage === undefined) {
    return "-";
  }

  const match = operation_stage.match(/^\w+(?=\s\()/);
  if (match === null) {
    return operation_stage;
  }

  return match[0];
}
function extractFirstWordVertical(vertical: string | undefined): string {
  if (vertical === undefined) {
    return "-";
  }

  const parts = vertical.split(" - ");

  return parts[0];
}

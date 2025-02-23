import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
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
  short_description: string;
  value_proposal: string;
  problem_that_is_solved: string;
  competitive_differentiator: string;
  last_twelve_months_revenue: string;
  is_approved: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organization_id } = params;

  if (!organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;

  try {
    const startups = await prisma.startups.findMany({
      where: {
        startup_organizations: {
          some: {
            organization_id: Number(organization_id),
          },
        },
      },
      orderBy: [{ is_approved: "desc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        vertical: true,
        country: true,
        business_model: true,
        operation_stage: true,
      },
    });

    const startupTable: StartupTable[] = startups.map((value) => ({
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
      last_twelve_months_revenue: value.last_twelve_months_revenue ?? "-",
      is_approved: value.is_approved ?? false,
    }));

    const totalCount = await prisma.startups.count({
      where: {
        startup_organizations: {
          some: {
            organization_id: Number(organization_id),
          },
        },
      },
    });

    return NextResponse.json(
      {
        startups: startupTable,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching startups:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching startups" },
      { status: 500 }
    );
  }
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

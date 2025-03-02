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
    const startupRelations = await prisma.startup_organizations.findMany({
      where: {
        organization_id: Number(organization_id),
      },
      select: {
        startup_id: true,
        is_approved: true,
      },
    });

    const startups = await prisma.startups.findMany({
      where: {
        id: {
          in: startupRelations.map((rel) => rel.startup_id),
        },
      },
      include: {
        vertical: true,
        country: true,
        business_model: true,
        operation_stage: true,
      },
    });

    const combinedStartups = startups.map((startup) => {
      const relation = startupRelations.find(
        (rel) => rel.startup_id === startup.id
      );
      return {
        ...startup,
        is_approved: relation?.is_approved || false,
      };
    });

    const sortedStartups = combinedStartups.sort((a, b) => {
      if (a.is_approved === b.is_approved) {
        return (a.name || "").localeCompare(b.name || "");
      }
      return a.is_approved ? -1 : 1;
    });

    const paginatedStartups = sortedStartups.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const startupTable: StartupTable[] = paginatedStartups.map((value) => ({
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
      country_flag: value.country?.code
        ? `https://${S3_STARTUP_COUNTRY_FLAGS}.s3.amazonaws.com/${value.country.code}.svg`
        : "",
      last_twelve_months_revenue: value.last_twelve_months_revenue ?? "-",
      is_approved: value.is_approved,
    }));

    const totalCount = startups.length;

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

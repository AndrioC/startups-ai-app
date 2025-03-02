import { EnterpriseCategoryType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

const S3_STARTUP_COUNTRY_FLAGS = process.env.S3_STARTUP_COUNTRY_FLAGS;

export interface EnterpriseTable {
  id: number;
  name: string | null;
  country: string;
  country_flag: string | null;
  enterprise_category: string;
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
  const enterpriseCategory = url.searchParams.get("enterpriseCategory");
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;

  if (!enterpriseCategory) {
    return NextResponse.json(
      { error: "Enterprise category is required" },
      { status: 400 }
    );
  }

  try {
    const enterpriseCategoryCode = convertToUpperSnakeCase(enterpriseCategory);

    const enterpriseCategoryId = await prisma.enterprise_category.findUnique({
      where: { code: enterpriseCategoryCode },
      select: { id: true },
    });

    if (!enterpriseCategoryId) {
      return NextResponse.json(
        { error: "Invalid Enterprise category" },
        { status: 400 }
      );
    }

    const enterpriseRelations = await prisma.enterprise_organizations.findMany({
      where: {
        organization_id: Number(organization_id),
      },
      select: {
        enterprise_id: true,
        is_approved: true,
      },
    });

    const enterprises = await prisma.enterprise.findMany({
      where: {
        enterprise_category_id: enterpriseCategoryId.id,
        id: {
          in: enterpriseRelations.map((rel) => rel.enterprise_id),
        },
      },
      include: {
        country: true,
        enterprise_category: true,
      },
    });

    const combinedEnterprises = enterprises.map((enterprise) => {
      const relation = enterpriseRelations.find(
        (rel) => rel.enterprise_id === enterprise.id
      );
      return {
        ...enterprise,
        is_approved: relation ? relation.is_approved : false,
      };
    });

    const sortedEnterprises = combinedEnterprises.sort((a, b) => {
      if (a.is_approved === b.is_approved) {
        return (a.name || "").localeCompare(b.name || "");
      }
      return a.is_approved ? -1 : 1;
    });

    const paginatedEnterprises = sortedEnterprises.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const enterpriseTable: EnterpriseTable[] = paginatedEnterprises.map(
      (value) => ({
        id: value.id,
        name: value.name,
        country: value?.country?.name_en ?? "-",
        enterprise_category: value?.enterprise_category?.name_en ?? "-",
        country_flag: value?.country?.code
          ? `https://${S3_STARTUP_COUNTRY_FLAGS}.s3.amazonaws.com/${value.country.code}.svg`
          : null,
        is_approved: value.is_approved,
      })
    );

    const totalCount = enterprises.length;

    return NextResponse.json(
      {
        enterprises: enterpriseTable,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enterprises:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching enterprises" },
      { status: 500 }
    );
  }
}

function convertToUpperSnakeCase(input: string): EnterpriseCategoryType {
  let result: string;

  if (input.includes("-")) {
    result = input
      .split("-")
      .map((word) => word.toUpperCase())
      .join("_");
  } else {
    result = input.toUpperCase();
  }

  if (
    Object.values(EnterpriseCategoryType).includes(
      result as EnterpriseCategoryType
    )
  ) {
    return result as EnterpriseCategoryType;
  } else {
    throw new Error(`"${result}" is not a valid EnterpriseCategoryType`);
  }
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_STARTUP_COUNTRY_FLAGS = process.env.S3_STARTUP_COUNTRY_FLAGS;
const S3_EXPERTS_IMAGES = process.env.S3_EXPERTS_LOGO_IMGS_BUCKET_NAME;

export interface ExpertTable {
  id: number;
  name: string | null;
  linkedin: string | null;
  picture_img_url: string;
  company: string | null;
  experience_with_startups_en: string;
  experience_with_startups_pt: string;
  is_approved: boolean;
  country: string;
  country_flag: string;
  state_city: string;
  status: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  try {
    const { organization_id } = params;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    if (!organization_id) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const [experts, totalCount] = await prisma.$transaction([
      prisma.experts.findMany({
        where: {
          expert_organizations: {
            some: {
              organization_id: Number(organization_id),
            },
          },
        },
        orderBy: [{ is_approved: "asc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          country: true,
        },
      }),
      prisma.experts.count({
        where: {
          expert_organizations: {
            some: {
              organization_id: Number(organization_id),
            },
          },
        },
      }),
    ]);

    const expertTable: ExpertTable[] = experts.map((value) => {
      return {
        id: value.id,
        name: value.name || null,
        linkedin: returnLinkedinWithHttps(value.linkedin),
        picture_img_url: `https://${S3_EXPERTS_IMAGES}.s3.amazonaws.com/${value.picture_img}`,
        company: value.company,
        experience_with_startups_en: value.experience_with_startups_en ?? "-",
        experience_with_startups_pt: value.experience_with_startups_pt ?? "-",
        is_approved: value.is_approved,
        country: value.country?.name_en ?? "-",
        country_flag: `https://${S3_STARTUP_COUNTRY_FLAGS}.s3.amazonaws.com/${value.country?.code}.svg`,
        state_city: value?.state_city ?? "-",
        status: value.is_approved ? "approved" : "pending",
      };
    });

    return NextResponse.json(
      {
        experts: expertTable,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching experts:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching experts" },
      { status: 500 }
    );
  }
}

function returnLinkedinWithHttps(linkedin: string | null): string | null {
  if (!linkedin) {
    return null;
  }

  if (!/^https?:\/\//i.test(linkedin)) {
    return `https://${linkedin}`;
  }

  return linkedin;
}

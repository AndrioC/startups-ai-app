import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

const S3_STARTUP_COUNTRY_FLAGS = process.env.S3_STARTUP_COUNTRY_FLAGS;
const S3_EXPERTS_IMAGES = process.env.S3_EXPERTS_LOGO_IMGS_BUCKET_NAME;

export interface ExpertTable {
  id: number;
  name: string;
  linkedin: string;
  picture_img_url: string;
  company: string;
  experience_with_startups_en: string;
  experience_with_startups_pt: string;
  is_approved: boolean;
  country: string;
  country_flag: string;
  state_city: string;
  status: string;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page"));
  const pageSize = Number(url.searchParams.get("pageSize"));

  const experts = await prisma.experts.findMany({
    orderBy: [{ is_approved: "asc" }, { name: "asc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      country: true,
    },
  });

  const expertTable: ExpertTable[] = experts.map((value) => {
    return {
      id: value.id,
      name: value.name,
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

  return NextResponse.json(expertTable, { status: 201 });
}

function returnLinkedinWithHttps(linkedin: string) {
  let newLink = linkedin;
  if (!/^https?:\/\//i.test(linkedin)) {
    newLink = "https://" + linkedin;
  }

  return newLink;
}

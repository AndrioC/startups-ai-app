import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function GET() {
  try {
    const country = await prisma.country.findMany();
    const vertical = await prisma.vertical.findMany();
    const operational_stage = await prisma.operational_stage.findMany();
    const business_model = await prisma.business_model.findMany();
    const challenges = await prisma.challenges.findMany();
    const objectives = await prisma.objectives.findMany();
    const position = await prisma.position.findMany();
    const service_products = await prisma.service_products.findMany();
    const maturity_level = await prisma.maturity_level.findMany();

    const enterprise_activity_area =
      await prisma.enterprise_activity_area.findMany({
        include: {
          enterprise_activity_area_category: {
            select: {
              id: true,
              code: true,
              name_en: true,
              name_pt: true,
            },
          },
        },
      });

    const enterprise_category = await prisma.enterprise_category.findMany();
    const enterprise_objectives = await prisma.enterprise_objectives.findMany();
    const enterprise_college_organization_type =
      await prisma.enterprise_college_organization_type.findMany();

    const enterprise_college_activity_area =
      await prisma.enterprise_college_activity_area.findMany();

    const data = {
      country,
      vertical,
      operational_stage,
      business_model,
      challenges,
      objectives,
      position,
      service_products,
      maturity_level,
      enterprise_activity_area,
      enterprise_category,
      enterprise_objectives,
      enterprise_college_organization_type,
      enterprise_college_activity_area,
    };

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

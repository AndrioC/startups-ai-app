import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function GET() {
  const country = await prisma.country.findMany();
  const vertical = await prisma.vertical.findMany();
  const operational_stage = await prisma.operational_stage.findMany();
  const business_model = await prisma.business_model.findMany();
  const challenges = await prisma.challenges.findMany();
  const objectives = await prisma.objectives.findMany();
  const position = await prisma.position.findMany();
  const service_products = await prisma.service_products.findMany();
  const maturity_level = await prisma.maturity_level.findMany();

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
  };

  return NextResponse.json(data, { status: 201 });
}

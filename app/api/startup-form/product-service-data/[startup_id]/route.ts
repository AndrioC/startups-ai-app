import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ProductServiceDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = ProductServiceDataSchema();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        quantity_ods_goals: data.quantityOdsGoals,
        problem_that_is_solved_pt: data.problemThatIsSolved,
        competitors: data.competitors,
        competitive_differentiator_pt: data.competitiveDifferentiator,
      },
    });

    await prisma.startup_service_products.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    const serviceProductsData = data.startupProductService.map((value) => ({
      startup_id: Number(params.startup_id),
      service_products_id: Number(value),
    }));

    await prisma.startup_service_products.createMany({
      data: serviceProductsData,
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating product-service: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { DeepTechDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = DeepTechDataSchema();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        maturity_level_id: Number(data.maturityLevel),
        has_patent: data.hasPatent,
        patent_and_code: data.patentAndCode,
      },
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating deep tech data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function GET() {
  const enterprise_category = await prisma.enterprise_category.findMany();

  const data = {
    enterprise_category,
  };

  return NextResponse.json(data, { status: 201 });
}

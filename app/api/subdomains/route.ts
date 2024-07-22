import { NextResponse } from "next/server";

import prisma from "../../../prisma/client";

export async function GET() {
  const subdomains = await prisma.organizations.findMany({
    select: { slug: true },
  });
  return NextResponse.json(subdomains, { status: 201 });
}

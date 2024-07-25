import { NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function GET() {
  const subdomains = await prisma.organizations.findMany({
    select: { slug: true, slug_admin: true },
  });

  const combinedSubdomains = subdomains.flatMap((s) => [s.slug, s.slug_admin]);

  return NextResponse.json(combinedSubdomains, { status: 201 });
}

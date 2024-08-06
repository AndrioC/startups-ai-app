import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";
export async function PUT(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const startupId = Number(url.searchParams.get("startupId"));

  if (!startupId) {
    return NextResponse.json(
      { error: "Sartup id not found!" },
      { status: 404 }
    );
  }

  await prisma.startups.update({
    where: { id: Number(startupId) },
    data: {
      profile_updated: false,
    },
  });

  return NextResponse.json({}, { status: 201 });
}

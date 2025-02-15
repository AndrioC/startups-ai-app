import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

interface DataRequest {
  is_approved: boolean;
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const startupId = Number(params.startup_id);
    if (isNaN(startupId)) {
      return new NextResponse("Invalid startup ID", { status: 400 });
    }

    const data = (await req.json()) as DataRequest;

    const startup = await prisma.startups.findFirst({
      where: {
        id: startupId,
        organization_id: session.user.organization_id,
      },
    });

    if (!startup) {
      return new NextResponse("Startup not found", { status: 404 });
    }

    const updatedStartup = await prisma.startups.update({
      where: {
        id: startupId,
      },
      data: {
        is_approved: data.is_approved,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedStartup);
  } catch (error) {
    console.error("Error updating startup status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

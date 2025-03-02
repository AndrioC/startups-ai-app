import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";

interface DataRequest {
  is_approved: boolean;
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { organization_id: string; enterprise_id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const organizationId = Number(params.organization_id);

    if (isNaN(organizationId)) {
      return new NextResponse("Invalid organization id", { status: 400 });
    }

    const url = new URL(request.url);
    const enterpriseId = url.searchParams.get("enterpriseId");

    const data = (await request.json()) as DataRequest;

    const enterprise = await prisma.enterprise.findFirst({
      where: {
        id: Number(enterpriseId),
        organization_id: session.user.organization_id,
      },
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    const updatedEnterprise = await prisma.enterprise.update({
      where: {
        id: Number(enterpriseId),
      },
      data: {
        is_approved: data.is_approved,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updatedEnterprise);
  } catch (error) {
    console.error("Error updating enterprise status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

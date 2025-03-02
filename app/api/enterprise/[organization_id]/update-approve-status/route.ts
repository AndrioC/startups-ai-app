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
    const enterpriseId =
      url.searchParams.get("enterpriseId") || params.enterprise_id;

    if (!enterpriseId) {
      return new NextResponse("Enterprise ID is required", { status: 400 });
    }

    const data = (await request.json()) as DataRequest;

    const enterprise = await prisma.enterprise.findFirst({
      where: {
        id: Number(enterpriseId),
      },
    });

    if (!enterprise) {
      return new NextResponse("Enterprise not found", { status: 404 });
    }

    const enterpriseOrganization =
      await prisma.enterprise_organizations.findUnique({
        where: {
          enterprise_id_organization_id: {
            enterprise_id: Number(enterpriseId),
            organization_id: organizationId,
          },
        },
      });

    if (!enterpriseOrganization) {
      return new NextResponse(
        "Enterprise not associated with this organization",
        { status: 404 }
      );
    }

    const updatedRelationship = await prisma.enterprise_organizations.update({
      where: {
        enterprise_id_organization_id: {
          enterprise_id: Number(enterpriseId),
          organization_id: organizationId,
        },
      },
      data: {
        is_approved: data.is_approved,
      },
    });

    return NextResponse.json({
      enterprise_id: enterprise.id,
      organization_id: organizationId,
      is_approved: updatedRelationship.is_approved,
    });
  } catch (error) {
    console.error("Error updating enterprise approval status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

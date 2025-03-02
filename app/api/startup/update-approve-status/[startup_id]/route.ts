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

    const organizationId = session.user.organization_id;
    const data = (await req.json()) as DataRequest;

    const startup = await prisma.startups.findFirst({
      where: {
        id: startupId,
      },
    });

    if (!startup) {
      return new NextResponse("Startup not found", { status: 404 });
    }

    const startupOrganization = await prisma.startup_organizations.findUnique({
      where: {
        startup_id_organization_id: {
          startup_id: startupId,
          organization_id: organizationId,
        },
      },
    });

    if (!startupOrganization) {
      return new NextResponse("Startup not associated with this organization", {
        status: 404,
      });
    }

    const updatedRelationship = await prisma.startup_organizations.update({
      where: {
        startup_id_organization_id: {
          startup_id: startupId,
          organization_id: organizationId,
        },
      },
      data: {
        is_approved: data.is_approved,
      },
    });

    return NextResponse.json({
      startup_id: startup.id,
      organization_id: organizationId,
      is_approved: updatedRelationship.is_approved,
    });
  } catch (error) {
    console.error("Error updating startup approval status:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

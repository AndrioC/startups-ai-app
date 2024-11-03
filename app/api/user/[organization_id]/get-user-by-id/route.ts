import { UserType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const organization_id = params.organization_id;

    if (!userId || !organization_id) {
      return NextResponse.json(
        { error: "Missing id or organization_id" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
        organization_id: Number(organization_id),
      },
      select: {
        id: true,
        type: true,
        name: true,
        logo_img: true,
        email: true,
        accepted_terms: true,
        is_blocked: true,
        accepted_terms_date: true,
        created_at: true,
        updated_at: true,
        email_verified: true,
        hashed_password: true,
        startup_id: true,
        expert_id: true,
        investor_id: true,
        organization_id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.type === UserType.SAI || user.type === UserType.ADMIN) {
      const userOrganization = await prisma.user_organizations.findFirst({
        where: {
          user_id: Number(userId),
          organization_id: Number(organization_id),
        },
        select: {
          organization_id: true,
          organization: {
            select: {
              slug: true,
              slug_admin: true,
            },
          },
        },
      });

      if (!userOrganization) {
        return NextResponse.json(
          { error: "User organization not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        ...user,
        organization_id: userOrganization.organization_id,
        organization_slug: userOrganization.organization.slug,
        organization_slug_admin: userOrganization.organization.slug_admin,
      });
    }

    const organization = await prisma.organizations.findUnique({
      where: { id: Number(organization_id) },
      select: {
        slug: true,
        slug_admin: true,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      organization_slug: organization.slug,
      organization_slug_admin: organization.slug_admin,
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

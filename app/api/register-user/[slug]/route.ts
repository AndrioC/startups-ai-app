import { UserType } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface DataRequest {
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerUserType: UserType;
  registerUserTerms: boolean;
}
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = (await request.json()) as DataRequest;
  if (!params.slug) {
    return NextResponse.json({ error: "Slug not found!" }, { status: 404 });
  }

  const organization = await prisma.organizations.findFirst({
    where: { slug: params.slug },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found!" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { email: data.registerEmail },
  });

  if (user) {
    return NextResponse.json(
      { error: "User already exists!" },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (prisma) => {
    let createdInfoId = 0;

    if (data.registerUserType === UserType.STARTUP) {
      const startup = await prisma.startups.create({
        data: {
          name: data.registerName,
          main_responsible_email: data.registerEmail,
          organization_id: organization.id,
        },
      });
      createdInfoId = startup.id;
    }

    if (data.registerUserType === UserType.INVESTOR) {
      const investor = await prisma.investors.create({
        data: {
          name: data.registerName,
          contact_email: data.registerEmail,
          organization_id: organization.id,
        },
      });
      createdInfoId = investor.id;
    }

    if (data.registerUserType === UserType.MENTOR) {
      const expert = await prisma.experts.create({
        data: {
          name: data.registerName,
          contact_email: data.registerEmail,
          organization_id: organization.id,
        },
      });
      createdInfoId = expert.id;
    }

    const hashedPassword = await bcryptjs.hash(data.registerPassword, 10);

    await prisma.user.create({
      data: {
        name: data.registerName,
        email: data.registerEmail,
        organization_id: organization.id,
        startup_id:
          data.registerUserType === UserType.STARTUP ? createdInfoId : null,
        investor_id:
          data.registerUserType === UserType.INVESTOR ? createdInfoId : null,
        expert_id:
          data.registerUserType === UserType.MENTOR ? createdInfoId : null,
        type: data.registerUserType,
        hashed_password: hashedPassword,
        accepted_terms: data.registerUserTerms,
      },
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating user: ", error);
    return NextResponse.json(error, { status: 500 });
  }
}

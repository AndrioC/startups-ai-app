import { EnterpriseCategoryType, UserType } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { sendVerificationEmail } from "@/actions/send-email-confirmation-account";
import { sendNewRegistrationNotification } from "@/actions/send-email-new-register-notification";
import prisma from "@/prisma/client";

interface DataRequest {
  registerName: string;
  registerEmail: string;
  registerPassword: string;
  registerUserType: UserType;
  registerUserTerms: boolean;
  enterpriseCategory: number;
  enterpriseCategoryCode: string;
  locale: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = (await request.json()) as DataRequest;
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
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
    where: { email: data.registerEmail, organization_id: organization.id },
  });

  if (user) {
    return NextResponse.json(
      { error: "User already exists!" },
      { status: 409 }
    );
  }

  let accountType = null;

  try {
    await prisma.$transaction(async (prisma) => {
      let createdInfoId = 0;

      if (data.registerUserType === UserType.STARTUP) {
        const startup = await prisma.startups.create({
          data: {
            main_responsible_email: data.registerEmail,
            organization_id: organization.id,
          },
        });
        accountType = UserType.STARTUP;
        createdInfoId = startup.id;

        await prisma.startup_organizations.create({
          data: {
            startup_id: startup.id,
            organization_id: organization.id,
            is_approved: false,
          },
        });

        if (token) {
          const programExists = await prisma.$queryRaw<
            { exists: boolean }[]
          >`SELECT EXISTS (
              SELECT 1 FROM programs
              WHERE encode(digest(CAST(id AS text), 'sha1'), 'hex') = ${token}
            ) AS exists`;

          if (programExists[0]?.exists) {
            const oldestKanban = await prisma.$queryRaw<
              { id: number }[]
            >`SELECT id FROM kanbans WHERE encode(digest(CAST(program_id AS text), 'sha1'), 'hex') = ${token} AND is_deleted = false ORDER BY created_at ASC LIMIT 1`;

            if (oldestKanban.length > 0) {
              await prisma.kanban_cards.create({
                data: {
                  kanban_id: oldestKanban[0].id,
                  startup_id: startup.id,
                  position_value: 0,
                },
              });
            } else {
              console.error("No kanban id found for program token:", token);
            }
          } else {
            console.error("Invalid program token:", token);
          }
        }
      }

      if (data.registerUserType === UserType.INVESTOR) {
        const investor = await prisma.investors.create({
          data: {
            name: data.registerName,
            contact_email: data.registerEmail,
            organization_id: organization.id,
          },
        });
        accountType = UserType.INVESTOR;
        createdInfoId = investor.id;

        await prisma.investor_organizations.create({
          data: {
            investor_id: investor.id,
            organization_id: organization.id,
            is_approved: false,
          },
        });
      }

      if (data.registerUserType === UserType.MENTOR) {
        const expert = await prisma.experts.create({
          data: {
            name: data.registerName,
            contact_email: data.registerEmail,
            organization_id: organization.id,
          },
        });
        accountType = UserType.MENTOR;
        createdInfoId = expert.id;

        await prisma.expert_organizations.create({
          data: {
            expert_id: expert.id,
            organization_id: organization.id,
            is_approved: false,
          },
        });
      }

      if (data.registerUserType === UserType.ENTERPRISE) {
        const enterprise = await prisma.enterprise.create({
          data: {
            name: data.registerName,
            main_responsible_email: data.registerEmail,
            organization_id: organization.id,
            enterprise_category_id: Number(data.enterpriseCategory),
          },
        });
        accountType = UserType.ENTERPRISE;
        createdInfoId = enterprise.id;

        await prisma.enterprise_organizations.create({
          data: {
            enterprise_id: enterprise.id,
            organization_id: organization.id,
            is_approved: false,
            is_blocked: false,
          },
        });
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
          enterprise_id:
            data.registerUserType === UserType.ENTERPRISE
              ? createdInfoId
              : null,
          type: data.registerUserType,
          hashed_password: hashedPassword,
          accepted_terms: data.registerUserTerms,
          accepted_terms_date: new Date(),
        },
      });
    });

    const users = await prisma.user.findMany({
      where: {
        organization_id: organization.id,
        type: { in: [UserType.ADMIN, UserType.SAI] },
        startup_id: null,
        investor_id: null,
        expert_id: null,
        enterprise_id: null,
      },
    });

    const usersEmail = users.map((user) => user.email);
    const enterpriseCategoryFormatted = formatString(
      data.enterpriseCategoryCode
    );

    await sendVerificationEmail(data.registerEmail, data.locale, organization);
    await sendNewRegistrationNotification(
      data.registerName,
      data.registerEmail,
      organization.slug!,
      usersEmail,
      accountType,
      enterpriseCategoryFormatted as EnterpriseCategoryType
    );

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error creating user: ", error);
    return NextResponse.json(error, { status: 500 });
  }
}

function formatString(input: string) {
  let result = input.toLowerCase();

  result = result.replace(/_/g, "-");

  return result;
}

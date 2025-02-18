import { Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateProfileUpdated } from "@/actions/update-profile-updated";
import { updateStartupFilledPercentage } from "@/actions/update-startup-filled-percentage";
import { updateStartupKanban } from "@/actions/update-startup-kanban";
import { auth } from "@/auth";
import { TeamDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const session = await auth();
  const locale = session?.user?.language === Language.PT_BR ? "pt-br" : "en";

  const messages = (await import(`@/translation/${locale}.json`)).default;
  const t = await getTranslations({
    locale,
    messages,
  });

  const tValidation = (key: string) => t(`startupForm.teamDataForm.${key}`);
  const formSchema = TeamDataSchema(tValidation);

  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        main_responsible_name: data.mainResponsibleName,
        contact_number: data.contactNumber,
        main_responsible_email: data.mainResponsibleEmail,
        employees_quantity: data.employeesQuantity,
        fulltime_employees_quantity: data.fullTimeEmployeesQuantity,
        was_processed: false,
        updated_at: new Date(),
      },
    });

    await prisma.startup_partner.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    const partnersData = data?.partners?.map((value) => ({
      startup_id: Number(params.startup_id),
      position_id: Number(value.position_id),
      name: value.name,
      phone: value.phone,
      email: value.email,
      is_founder: value.is_founder,
      dedication: value.dedication_type,
      captable: Number(value.percentage_captable),
      is_first_business: value.is_first_business,
      linkedin_lattes: value.linkedin_lattes,
      has_experience_or_formation_at_startup_field:
        value.has_experience_or_formation,
      is_partners_formation_complementary: value.is_formation_complementary,
    }));

    if (partnersData) {
      await prisma.startup_partner.createMany({
        data: partnersData,
      });
    }
  });

  await updateProfileUpdated(Number(params.startup_id));
  await updateStartupFilledPercentage(Number(params.startup_id));
  await updateStartupKanban(Number(params.startup_id));

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating team data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

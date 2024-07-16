import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { TeamDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = TeamDataSchema();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
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
      },
    });

    await prisma.startup_partner.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    const partnersData = data.partners.map((value) => ({
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

    await prisma.startup_partner.createMany({
      data: partnersData,
    });
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating team data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

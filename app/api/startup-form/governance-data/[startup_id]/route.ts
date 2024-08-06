import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { updateProfileUpdated } from "@/actions/update-profile-updated";
import { updateStartupFilledPercentage } from "@/actions/update-startup-filled-percentage";
import { updateStartupKanban } from "@/actions/update-startup-kanban";
import { GovernanceDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = GovernanceDataSchema();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        is_startup_officially_registered: data.isStartupOfficiallyRegistered,
        is_there_partners_agreement_signed: data.isTherePartnersAgreementSigned,
        have_legal_advice: data.haveLegalAdvice,
        have_accounting_advice: data.haveAccountingConsultancy,
        relationships_registered_in_contract:
          data.relationshipsRegisteredInContract,
        was_processed: false,
        updated_at: new Date(),
      },
    });
  });

  await updateProfileUpdated(Number(params.startup_id));
  await updateStartupFilledPercentage(Number(params.startup_id));
  await updateStartupKanban(Number(params.startup_id));

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating governance data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

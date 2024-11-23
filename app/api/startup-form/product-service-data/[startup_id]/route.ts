import { Language } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateProfileUpdated } from "@/actions/update-profile-updated";
import { updateStartupFilledPercentage } from "@/actions/update-startup-filled-percentage";
import { updateStartupKanban } from "@/actions/update-startup-kanban";
import { auth } from "@/auth";
import { ProductServiceDataSchema } from "@/lib/schemas/schema-startup";
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

  const tValidation = (key: string) =>
    t(`startupForm.productServiceForm.${key}`);
  const formSchema = ProductServiceDataSchema(tValidation);

  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        quantity_ods_goals: data.quantityOdsGoals,
        problem_that_is_solved_pt: data.problemThatIsSolved,
        competitors: data.competitors,
        competitive_differentiator_pt: data.competitiveDifferentiator,
        was_processed: false,
        updated_at: new Date(),
      },
    });

    await prisma.startup_service_products.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    const serviceProductsData = data.startupProductService.map((value) => ({
      startup_id: Number(params.startup_id),
      service_products_id: Number(value),
    }));

    await prisma.startup_service_products.createMany({
      data: serviceProductsData,
    });
  });

  await updateProfileUpdated(Number(params.startup_id));
  await updateStartupFilledPercentage(Number(params.startup_id));
  await updateStartupKanban(Number(params.startup_id));

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating product-service: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

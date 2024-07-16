import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { FinanceAndMarketDataSchema } from "@/lib/schemas/schema-startup";
import prisma from "@/prisma/client";

const formSchema = FinanceAndMarketDataSchema();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const data = (await request.json()) as z.infer<typeof formSchema>;

  await prisma.$transaction(async (prisma) => {
    await prisma.startups.update({
      where: { id: Number(params.startup_id) },
      data: {
        customers_quantity: data.payingCustomersQuantity.toString(),
        active_customers_quantity: data.activeCustomersQuantity.toString(),
        already_earning: data.alreadyEarning,
        last_revenue: data.alreadyEarning ? data.lastRevenue : null,
        last_six_months_revenue: data.alreadyEarning
          ? data.lastSixMonthsRevenue
          : null,
        last_twelve_months_revenue: data.alreadyEarning
          ? data.lastTwelveMonthsRevenue
          : null,
        saas_current_rrm: data.alreadyEarning ? data.saasCurrentRRM : null,
        is_there_open_investment_round: data.isThereOpenInvestmentRound,
        value_collection: data.isThereOpenInvestmentRound
          ? data.valueCollection
          : null,
        equity_percentage: data.isThereOpenInvestmentRound
          ? data.equityPercentage
          : null,
        current_startup_valuation: data.isThereOpenInvestmentRound
          ? data.currentStartupValuation
          : null,
        round_start_date: data.isThereOpenInvestmentRound
          ? data.roundStartDate
          : null,
        round_end_date: data.isThereOpenInvestmentRound
          ? data.roundEndDate
          : null,
      },
    });

    await prisma.startup_investiments_rounds.deleteMany({
      where: { startup_id: Number(params.startup_id) },
    });

    if (data.investments) {
      const investmentsRounds = data.investments?.map((value) => ({
        startup_id: Number(params.startup_id),
        round_start_date: value.roundInvestmentStartDate!,
        round_end_date: value.roundInvestmentEndDate!,
        total_received: value.collectedTotal,
        equities_percentual: Number(value.equityDistributedPercent),
        investors_quantity: Number(value.investorsQuantity),
        ventures_or_investors: value.investors,
      }));

      await prisma.startup_investiments_rounds.createMany({
        data: investmentsRounds,
      });
    }
  });

  try {
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.log("error updating governance data startup: ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

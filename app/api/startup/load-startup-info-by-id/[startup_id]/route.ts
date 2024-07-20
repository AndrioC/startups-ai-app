import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface Block {
  [key: string]: any;
}

const STARTUPS_LOGO_BUCKET = process.env
  .S3_STARTUP_LOGO_IMGS_BUCKET_NAME as string;
const STARTUPS_PITCH_BUCKET = process.env
  .S3_STARTUP_PITCH_DECK_FILES_BUCKET_NAME as string;

export interface StartupTable {
  id: number;
  name: string;
  vertical: string;
  country: string;
  business_model: string;
  business_model_code: string;
  operation_stage: string;
  country_flag: string;
  status: string;
  short_description: string;
  value_proposal: string;
  problem_that_is_solved: string;
  competitive_differentiator: string;
  last_twelve_months_revenue: string;
  is_approved: boolean;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { startup_id: string } }
) {
  const startup = await prisma.startups.findUnique({
    where: { id: Number(params.startup_id) },
    include: {
      startup_challenges: true,
      startup_objectives: true,
      startup_partner: true,
      startup_service_products: true,
      startup_investiments_rounds: true,
      business_model: true,
      vertical: true,
    },
  });

  const partners = startup?.startup_partner
    ? startup?.startup_partner.map((partner) => ({
        name: partner.name,
        phone: partner.phone,
        email: partner.email,
        position_id: partner.position_id,
        is_founder: partner.is_founder,
        dedication_type: partner.dedication,
        percentage_captable: partner.captable,
        is_first_business: partner.is_first_business,
        linkedin_lattes: partner.linkedin_lattes,
        has_experience_or_formation:
          partner.has_experience_or_formation_at_startup_field,
        is_formation_complementary: partner.is_partners_formation_complementary,
      }))
    : [];

  const investments = startup?.startup_investiments_rounds
    ? startup?.startup_investiments_rounds.map((startup_investment) => ({
        id: startup_investment.id,
        startup_id: startup_investment.startup_id,
        roundInvestmentStartDate:
          startup_investment.round_start_date ?? undefined,
        roundInvestmentEndDate: startup_investment.round_end_date ?? undefined,
        collectedTotal: startup_investment.total_received,
        equityDistributedPercent:
          startup_investment.equities_percentual.toString(),
        investorsQuantity: startup_investment.investors_quantity.toString(),
        investors: startup_investment.ventures_or_investors,
      }))
    : [];

  console.log("image", startup?.logo_img);
  const generalData: Block = {
    startupId: startup?.id,
    startupName: startup?.name,
    country: startup?.country_id?.toString(),
    vertical: startup?.vertical_id?.toString(),
    verticalText: startup?.vertical?.name_pt,
    stateAndCity: startup?.state_city,
    operationalStage: startup?.operation_stage_id?.toString(),
    businessModel: startup?.business_model_id?.toString(),
    businessModelText: startup?.business_model?.name,
    subscriptionNumber: startup?.subscription_number,
    foundationDate: startup?.foundation_date?.toDateString(),
    referenceLink: startup?.reference_link,
    loadPitchDeck: `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup?.pitch_deck}`,
    loadLogo: `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup?.logo_img}`,
    loadPitchDeckUrl:
      startup?.pitch_deck !== null
        ? `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup?.pitch_deck}`
        : undefined,
    loadLogoUrl:
      startup?.logo_img !== null
        ? `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup?.logo_img}`
        : undefined,
    startupChallenges:
      startup?.startup_challenges.map((challenge) => {
        return challenge.challenge_id.toString();
      }) || [],
    startupObjectives:
      startup?.startup_objectives.map((objective) => {
        return objective.objective_id.toString();
      }) || [],
    connectionsOnlyOnStartupCountryOrigin:
      startup?.connections_only_on_origin_country,
    valueProposal: startup?.value_proposal_pt,
    shortDescription: startup?.short_description_pt,
  };

  const team: Block = {
    mainResponsibleName: startup?.main_responsible_name,
    contactNumber: startup?.contact_number,
    mainResponsibleEmail: startup?.main_responsible_email,
    employeesQuantity: startup?.employees_quantity,
    fullTimeEmployeesQuantity: startup?.fulltime_employees_quantity,
    partners,
  };

  const productService: Block = {
    startupProductService:
      startup?.startup_service_products.map((service_product) => {
        return service_product.service_products_id.toString();
      }) || [],
    quantityOdsGoals: startup?.quantity_ods_goals,
    problemThatIsSolved: startup?.problem_that_is_solved_pt,
    competitors: startup?.competitors,
    competitiveDifferentiator: startup?.competitive_differentiator_pt,
  };

  const deepTech: Block = {
    maturityLevel: startup?.maturity_level_id,
    hasPatent: startup?.has_patent,
    patentAndCode: startup?.patent_and_code,
  };

  const governance: Block = {
    isStartupOfficiallyRegistered: startup?.is_startup_officially_registered,
    isTherePartnersAgreementSigned: startup?.is_there_partners_agreement_signed,
    haveLegalAdvice: startup?.have_legal_advice,
    haveAccountingConsultancy: startup?.have_accounting_advice,
    relationshipsRegisteredInContract:
      startup?.relationships_registered_in_contract,
  };

  const marketFinance: Block = {
    payingCustomersQuantity: startup?.customers_quantity ?? "",
    activeCustomersQuantity: startup?.active_customers_quantity ?? "",
    alreadyEarning: startup?.already_earning ?? false,
    lastRevenue: startup?.last_revenue ?? "",
    lastSixMonthsRevenue: startup?.last_six_months_revenue ?? "",
    lastTwelveMonthsRevenue: startup?.last_twelve_months_revenue ?? "",
    saasCurrentRRM: startup?.saas_current_rrm ?? "",
    isThereOpenInvestmentRound:
      startup?.is_there_open_investment_round ?? false,
    valueCollection: startup?.value_collection ?? "",
    equityPercentage: startup?.equity_percentage ?? 0,
    currentStartupValuation: startup?.current_startup_valuation ?? "",
    roundStartDate: startup?.round_start_date ?? undefined,
    roundEndDate: startup?.round_end_date ?? undefined,
    investments,
  };

  const blocks: { [key: string]: Block } = {
    generalData,
    team,
    productService,
    deepTech,
    governance,
    marketFinance,
  };

  const filledPercentages: { [key: string]: number } = Object.keys(
    blocks
  ).reduce((acc: { [key: string]: number }, blockName: string) => {
    acc[blockName] = calculateFilledPercentage(blocks[blockName]);
    return acc;
  }, {});

  return NextResponse.json({ blocks, filledPercentages }, { status: 201 });
}

function calculateFilledPercentage(block: Block): number {
  const totalFields = Object.keys(block).length;
  const filledFields = Object.values(block).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== "";
  }).length;
  return (filledFields / totalFields) * 100;
}

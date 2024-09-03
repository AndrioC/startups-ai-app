import {
  startup_challenges,
  startup_investiments_rounds,
  startup_objectives,
  startup_partner,
  startup_service_products,
  startups,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface Block {
  [key: string]: any;
}

const STARTUPS_LOGO_BUCKET = process.env
  .S3_STARTUP_LOGO_IMGS_BUCKET_NAME as string;
const STARTUPS_PITCH_BUCKET = process.env
  .S3_STARTUP_PITCH_DECK_FILES_BUCKET_NAME as string;

export interface StartupTab extends startups {
  startup_partner: startup_partner[];
  startup_investiments_rounds: startup_investiments_rounds[];
  startup_challenges: startup_challenges[];
  startup_service_products: startup_service_products[];
  startup_objectives: startup_objectives[];
  business_model: string;
  vertical: string;
  country: string;
  operation_stage: string;
  maturity_level: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const startup: StartupTab[] = await prisma.$queryRaw`
      WITH startup_data AS (
        SELECT 
          s.*,
          bm.name AS business_model,
          v.name_pt AS vertical,
          c.name_pt AS country,
          os.name_pt AS operation_stage,
          ml.name_pt AS maturity_level
        FROM 
          startups s
        LEFT JOIN
          business_model bm ON s.business_model_id = bm.id
        LEFT JOIN
          vertical v ON s.vertical_id = v.id
        LEFT JOIN
          country c ON s.country_id = c.id
        LEFT JOIN
          operational_stage os ON s.operation_stage_id = os.id
        LEFT JOIN
          maturity_level ml ON s.maturity_level_id = ml.id
        WHERE 
          encode(digest(CAST(s.id AS text), 'sha1'), 'hex') = ${token}
      ),
      startup_challenges AS (
        SELECT 
          json_agg(sc.*) AS challenges
        FROM 
          startup_challenges sc
        WHERE 
          sc.startup_id = (SELECT id FROM startup_data)
      ),
      startup_objectives AS (
        SELECT 
          json_agg(so.*) AS objectives
        FROM 
          startup_objectives so
        WHERE 
          so.startup_id = (SELECT id FROM startup_data)
      ),
      startup_partners AS (
        SELECT 
          json_agg(sp.*) AS partners
        FROM 
          startup_partner sp
        WHERE 
          sp.startup_id = (SELECT id FROM startup_data)
      ),
      startup_service_products AS (
        SELECT 
          json_agg(ssp.*) AS service_products
        FROM 
          startup_service_products ssp
        WHERE 
          ssp.startup_id = (SELECT id FROM startup_data)
      ),
      startup_investiments_rounds AS (
        SELECT 
          json_agg(sir.*) AS investment_rounds
        FROM 
          startup_investiments_rounds sir
        WHERE 
          sir.startup_id = (SELECT id FROM startup_data)
      )
      SELECT 
        sd.*,
        sc.challenges AS startup_challenges,
        so.objectives AS startup_objectives,
        sp.partners AS startup_partner,
        ssp.service_products AS startup_service_products,
        sir.investment_rounds AS startup_investiments_rounds
      FROM 
        startup_data sd,
        startup_challenges sc,
        startup_objectives so,
        startup_partners sp,
        startup_service_products ssp,
        startup_investiments_rounds sir
    `;

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    const partners = startup[0].startup_partner
      ? startup[0].startup_partner.map((partner) => ({
          name: partner.name,
          phone: partner.phone,
          email: partner.email,
          position_id: partner.position_id.toString(),
          is_founder: partner.is_founder,
          dedication_type: partner.dedication,
          percentage_captable: partner.captable,
          is_first_business: partner.is_first_business,
          linkedin_lattes: partner.linkedin_lattes,
          has_experience_or_formation:
            partner.has_experience_or_formation_at_startup_field,
          is_formation_complementary:
            partner.is_partners_formation_complementary,
        }))
      : [];

    const investments = startup[0].startup_investiments_rounds
      ? startup[0].startup_investiments_rounds.map((startup_investment) => ({
          id: startup_investment.id,
          startup_id: startup_investment.startup_id,
          roundInvestmentStartDate:
            startup_investment.round_start_date ?? undefined,
          roundInvestmentEndDate:
            startup_investment.round_end_date ?? undefined,
          collectedTotal: startup_investment.total_received,
          equityDistributedPercent:
            startup_investment.equities_percentual.toString(),
          investorsQuantity: startup_investment.investors_quantity.toString(),
          investors: startup_investment.ventures_or_investors,
        }))
      : [];

    const generalData: Block = {
      startupId: startup[0].id,
      startupName: startup[0].name,
      country: startup[0].country,
      vertical: startup[0].vertical,
      stateAndCity: startup[0].state_city,
      operationalStage: startup[0].operation_stage,
      businessModel: startup[0].business_model,
      subscriptionNumber: startup[0].subscription_number,
      foundationDate: startup[0].foundation_date?.toDateString(),
      referenceLink: startup[0].reference_link,
      loadPitchDeck:
        startup[0].pitch_deck && startup[0].pitch_deck.trim() !== ""
          ? `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup[0].pitch_deck}`
          : undefined,
      loadLogo:
        startup[0].logo_img && startup[0].logo_img.trim() !== ""
          ? `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup[0].logo_img}`
          : undefined,
      loadPitchDeckUrl:
        startup[0].pitch_deck && startup[0].pitch_deck.trim() !== ""
          ? `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup[0].pitch_deck}`
          : undefined,
      loadLogoUrl:
        startup[0].logo_img && startup[0].logo_img.trim() !== ""
          ? `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup[0].logo_img}`
          : undefined,
      startupChallenges:
        startup[0].startup_challenges?.map((challenge) => {
          return challenge.challenge_id.toString();
        }) || [],
      startupObjectives:
        startup[0].startup_objectives?.map((objective) => {
          return objective.objective_id.toString();
        }) || [],
      connectionsOnlyOnStartupCountryOrigin:
        startup[0].connections_only_on_origin_country,
      valueProposal: startup[0].value_proposal_pt,
      shortDescription: startup[0].short_description_pt,
    };

    const team: Block = {
      mainResponsibleName: startup[0].main_responsible_name,
      contactNumber: startup[0].contact_number,
      mainResponsibleEmail: startup[0].main_responsible_email,
      employeesQuantity: startup[0].employees_quantity,
      fullTimeEmployeesQuantity: startup[0].fulltime_employees_quantity,
      partners,
    };

    const productService: Block = {
      startupProductService:
        startup[0].startup_service_products?.map((service_product) => {
          return service_product.service_products_id.toString();
        }) || [],
      quantityOdsGoals: startup[0].quantity_ods_goals,
      problemThatIsSolved: startup[0].problem_that_is_solved_pt,
      competitors: startup[0].competitors,
      competitiveDifferentiator: startup[0].competitive_differentiator_pt,
    };

    const deepTech: Block = {
      maturityLevel: startup[0].maturity_level,
      hasPatent: startup[0].has_patent,
      patentAndCode: startup[0].patent_and_code,
    };

    const governance: Block = {
      isStartupOfficiallyRegistered:
        startup[0].is_startup_officially_registered,
      isTherePartnersAgreementSigned:
        startup[0].is_there_partners_agreement_signed,
      haveLegalAdvice: startup[0].have_legal_advice,
      haveAccountingConsultancy: startup[0].have_accounting_advice,
      relationshipsRegisteredInContract:
        startup[0].relationships_registered_in_contract,
    };

    const marketFinance: Block = {
      payingCustomersQuantity: startup[0].customers_quantity ?? "",
      activeCustomersQuantity: startup[0].active_customers_quantity ?? "",
      alreadyEarning: startup[0].already_earning ?? false,
      lastRevenue: startup[0].last_revenue ?? "",
      lastSixMonthsRevenue: startup[0].last_six_months_revenue ?? "",
      lastTwelveMonthsRevenue: startup[0].last_twelve_months_revenue ?? "",
      saasCurrentRRM: startup[0].saas_current_rrm ?? "",
      isThereOpenInvestmentRound:
        startup[0].is_there_open_investment_round ?? false,
      valueCollection: startup[0].value_collection ?? "",
      equityPercentage: startup[0].equity_percentage ?? 0,
      currentStartupValuation: startup[0].current_startup_valuation ?? "",
      roundStartDate: startup[0].round_start_date ?? undefined,
      roundEndDate: startup[0].round_end_date ?? undefined,
      investments,
    };

    const profile: Block = {
      startupProfile: startup[0].startup_profile,
    };

    const blocks: { [key: string]: Block } = {
      generalData,
      team,
      productService,
      deepTech,
      governance,
      marketFinance,
      profile,
    };

    const blocksToCalculate = [
      "generalData",
      "team",
      "productService",
      "governance",
      "marketFinance",
    ];

    const fieldsToCalculate = getFieldsToCalculate();

    const filledPercentages: { [key: string]: number } =
      blocksToCalculate.reduce(
        (acc: { [key: string]: number }, blockName: string) => {
          acc[blockName] = calculateFilledPercentage(
            blocks[blockName],
            fieldsToCalculate[blockName]
          );
          return acc;
        },
        {}
      );

    return NextResponse.json({ blocks, filledPercentages }, { status: 201 });
  } catch (error) {
    console.error("Error fetching startup data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateFilledPercentage(
  block: Block,
  relevantFields: string[] = []
): number {
  const totalFields = relevantFields.length;
  const filledFields = relevantFields.filter((field) => {
    const value = block[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== undefined && value !== null && value !== "";
  }).length;

  return (filledFields / totalFields) * 100;
}

function getFieldsToCalculate(): { [key: string]: string[] } {
  return {
    generalData: [
      "startupName",
      "country",
      "vertical",
      "stateAndCity",
      "operationalStage",
      "businessModel",
      "subscriptionNumber",
      "loadPitchDeckUrl",
      "loadLogoUrl",
      "foundationDate",
      "referenceLink",
      "startupChallenges",
      "startupObjectives",
      "connectionsOnlyOnStartupCountryOrigin",
      "valueProposal",
      "shortDescription",
    ],
    team: [
      "mainResponsibleName",
      "contactNumber",
      "mainResponsibleEmail",
      "employeesQuantity",
      "fullTimeEmployeesQuantity",
    ],
    productService: [
      "startupProductService",
      "quantityOdsGoals",
      "problemThatIsSolved",
      "competitors",
      "competitiveDifferentiator",
    ],
    governance: [
      "isStartupOfficiallyRegistered",
      "isTherePartnersAgreementSigned",
      "haveLegalAdvice",
      "haveAccountingConsultancy",
      "relationshipsRegisteredInContract",
    ],
    marketFinance: ["payingCustomersQuantity", "activeCustomersQuantity"],
  };
}

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface Block {
  [key: string]: any;
}

interface ComparationType {
  key: "equal" | "greater_than" | "less_than";
  label_pt: string;
  label_en: string;
}

interface Option {
  value: string;
  label_pt: string;
  label_en: string;
}

interface Rule {
  key: string;
  kanban_id: number;
  rule: string;
  comparation_type: ComparationType[];
  field_type:
    | "multiple_select"
    | "single_select"
    | "datepicker"
    | "numeric_input";
  options?: Option[];
}

export interface ProgramData {
  program_id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  rules: Rule[];
}

const STARTUPS_LOGO_BUCKET = process.env
  .S3_STARTUP_LOGO_IMGS_BUCKET_NAME as string;

const STARTUPS_PITCH_BUCKET = process.env
  .S3_STARTUP_PITCH_DECK_FILES_BUCKET_NAME as string;

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME =
  process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME;

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
      organizations: true,
      kanban_cards: {
        include: {
          kanban: {
            include: {
              program: true,
              rule: true,
            },
          },
        },
      },
    },
  });

  const generatedProfiles = await prisma.startup_generated_profiles.findMany({
    where: {
      startup_id: Number(params.startup_id),
    },
    orderBy: [{ generated_date: "asc" }, { id: "asc" }],
  });

  const numberedProfiles = generatedProfiles
    .map((profile, index) => ({
      ...profile,
      profile_number: index + 1,
    }))
    .sort((a, b) => a.profile_number - b.profile_number);

  const partners = startup?.startup_partner
    ? startup?.startup_partner.map((partner) => ({
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
    loadPitchDeck:
      startup?.pitch_deck && startup.pitch_deck.trim() !== ""
        ? `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup.pitch_deck}`
        : undefined,
    loadLogo:
      startup?.logo_img && startup.logo_img.trim() !== ""
        ? `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup.logo_img}`
        : undefined,
    loadPitchDeckUrl:
      startup?.pitch_deck && startup.pitch_deck.trim() !== ""
        ? `https://${STARTUPS_PITCH_BUCKET}.s3.amazonaws.com/${startup.pitch_deck}`
        : undefined,
    loadLogoUrl:
      startup?.logo_img && startup.logo_img.trim() !== ""
        ? `https://${STARTUPS_LOGO_BUCKET}.s3.amazonaws.com/${startup.logo_img}`
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
    organizationLogo: startup?.organizations?.logo_img
      ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${startup?.organizations?.logo_img}`
      : null,
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

  const activeProfile = generatedProfiles.find((profile) => profile.active);

  const profile: Block = {
    startupProfile: activeProfile ? activeProfile.profile : null,
    allGeneratedProfiles: numberedProfiles,
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

  const filledPercentages: { [key: string]: number } = blocksToCalculate.reduce(
    (acc: { [key: string]: number }, blockName: string) => {
      acc[blockName] = calculateFilledPercentage(
        blocks[blockName],
        fieldsToCalculate[blockName]
      );
      return acc;
    },
    {}
  );

  const programIds =
    startup?.kanban_cards.map((card) => card.kanban.program.id) || [];

  const rules = await prisma.rule.findMany({
    where: {
      program_id: {
        in: programIds,
      },
    },
    include: {
      program: true,
    },
  });

  const programsMap = new Map<number, ProgramData>();

  rules.forEach((rule) => {
    const program = rule.program;

    if (!programsMap.has(program.id)) {
      programsMap.set(program.id, {
        program_id: program.id,
        name: program.program_name,
        startDate: program.start_date,
        endDate: program.end_date,
        rules: [],
      });
    }

    const programData = programsMap.get(program.id)!;

    programData.rules.push({
      key: rule.key,
      kanban_id: rule.kanban_id,
      rule: rule.rule,
      comparation_type: safeJsonParse<ComparationType[]>(
        rule.comparation_type as string
      ),
      field_type: rule.field_type as Rule["field_type"],
      options: rule.options
        ? safeJsonParse<Option[]>(rule.options as string)
        : undefined,
    });
  });

  const programsData: ProgramData[] = Array.from(programsMap.values());

  return NextResponse.json(
    { blocks, filledPercentages, programsData },
    { status: 201 }
  );
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

function safeJsonParse<T>(value: string | T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return value as unknown as T;
    }
  }
  return value;
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

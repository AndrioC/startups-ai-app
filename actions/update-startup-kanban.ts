import { PrismaClient } from "@prisma/client";

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

const prisma = new PrismaClient();

export async function updateStartupKanban(startupId: number) {
  const startup = await prisma.startups.findUnique({
    where: { id: startupId },
    include: {
      vertical: true,
      operation_stage: true,
      business_model: true,
      startup_objectives: {
        include: { objectives: true },
      },
      startup_challenges: {
        include: { challenge: true },
      },
      startup_service_products: {
        include: { service_products: true },
      },
      maturity_level: true,
      startup_investiments_rounds: true,
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

  if (!startup) {
    throw new Error("Startup not found");
  }

  if (
    startup.profile_filled_percentage === null ||
    startup.profile_filled_percentage !== 100
  ) {
    return;
  }

  const programIds =
    startup?.kanban_cards.map((card) => card.kanban.program.id) || [];

  const currentDate = new Date();

  const rules = await prisma.rule.findMany({
    where: {
      program_id: {
        in: programIds,
      },
      program: {
        end_date: {
          gt: currentDate,
        },
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

  const startupData = {
    vertical: startup.vertical?.code,
    operational_stage: startup.operation_stage?.code,
    business_model: startup.business_model?.code,
    foundation_date: startup.foundation_date,
    objectives: startup.startup_objectives.map((obj) => obj.objectives.code),
    challenges: startup.startup_challenges.map((ch) => ch.challenge.code),
    employees_quantity: startup.employees_quantity,
    fulltime_employees_quantity: startup.fulltime_employees_quantity,
    partners_quantity: startup.partners_quantity,
    service_products: startup.startup_service_products.map(
      (sp) => sp.service_products.code
    ),
    quantity_ods_goals: startup.quantity_ods_goals,
    maturity_level: startup.maturity_level?.code,
    has_patent: startup.has_patent,
    is_startup_officially_registered: startup.is_startup_officially_registered,
    is_there_partners_agreement_signed:
      startup.is_there_partners_agreement_signed,
    have_legal_advice: startup.have_legal_advice,
    have_accounting_advice: startup.have_accounting_advice,
    relationships_registered_in_contract:
      startup.relationships_registered_in_contract,
    customers_quantity: startup.customers_quantity,
    active_customers_quantity: startup.active_customers_quantity,
    already_earning: startup.already_earning,
    is_there_open_investment_round: startup.is_there_open_investment_round,
    startup_investiments_rounds: startup.startup_investiments_rounds.length,
  };

  const programsData: ProgramData[] = Array.from(programsMap.values());

  await Promise.all(
    programsData.flatMap(async (program) =>
      Promise.all(
        program.rules.map(async (rule) => {
          const startupValue =
            startupData[rule.key as keyof typeof startupData];
          let passes = false;

          passes = rule.comparation_type.some((comparison) =>
            checkRule(
              comparison.key,
              startupValue,
              rule.rule,
              rule.options,
              rule.field_type
            )
          );

          if (passes) {
            const existingCard = await prisma.kanban_cards.findFirst({
              where: {
                startup_id: startupId,
                kanban: {
                  program_id: program.program_id,
                },
              },
            });

            if (existingCard) {
              await prisma.kanban_cards.update({
                where: { id: existingCard.id },
                data: { kanban_id: rule.kanban_id },
              });
            }
          }
        })
      )
    )
  );
}

function checkRule(
  comparationType: "equal" | "greater_than" | "less_than",
  startupValue: any,
  ruleValue: string,
  options: Option[] | undefined,
  fieldType:
    | "multiple_select"
    | "single_select"
    | "datepicker"
    | "numeric_input"
): boolean {
  switch (fieldType) {
    case "multiple_select":
    case "single_select":
      if (comparationType === "equal" && options) {
        if (Array.isArray(startupValue)) {
          return startupValue.some((value) =>
            options.some((option) => option.value === value)
          );
        } else {
          return options.some((option) => option.value === startupValue);
        }
      }
      return false;
    case "datepicker": {
      const startupDate = new Date(startupValue);
      const ruleDate = new Date(ruleValue);
      switch (comparationType) {
        case "equal":
          return startupDate.getTime() === ruleDate.getTime();
        case "greater_than":
          return startupDate > ruleDate;
        case "less_than":
          return startupDate < ruleDate;
        default:
          return false;
      }
    }
    case "numeric_input": {
      const startupNumber = parseFloat(startupValue);
      const ruleNumber = parseFloat(ruleValue);
      switch (comparationType) {
        case "equal":
          return startupNumber === ruleNumber;
        case "greater_than":
          return startupNumber > ruleNumber;
        case "less_than":
          return startupNumber < ruleNumber;
        default:
          return false;
      }
    }
    default:
      return false;
  }
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

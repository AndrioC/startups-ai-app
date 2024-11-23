import { z } from "zod";
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_IMAGE_FILE = 1024 * 1024;

export const GeneralDataSchema = (t?: any) =>
  z.object({
    startupName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, t("validation.required"))),
    country: z.string().min(1, t("validation.required")),
    vertical: z.string().min(1, t("validation.required")),
    stateAndCity: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, t("validation.required"))),
    operationalStage: z.string().min(1, t("validation.required")),
    businessModel: z.string().min(1, t("validation.required")),
    subscriptionNumber: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v)),
    foundationDate: z.preprocess(
      (val: any) => (val ? new Date(val) : val),
      z
        .date({
          required_error: t("validation.required"),
        })
        .nullable()
        .optional()
    ),
    referenceLink: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) => !val || val.length >= 3,
        t("validation.websiteMinLength")
      ),
    loadPitchDeck: z
      .union([z.string(), z.instanceof(File), z.undefined()])
      .refine(
        (v) => {
          if (typeof v === "string") return v.trim() !== "";
          if (v instanceof File) return v.name !== "" && v.size > 0;
          return false;
        },
        { message: t("validation.required") }
      )
      .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, {
        message: t("validation.fileTooLarge"),
      }),
    loadLogo: z
      .union([z.string(), z.instanceof(File), z.undefined()])
      .refine(
        (v) => {
          if (typeof v === "string") return v.trim() !== "";
          if (v instanceof File) return v.name !== "" && v.size > 0;
          return false;
        },
        { message: t("validation.required") }
      )
      .refine(
        (file) => !(file instanceof File) || file.size <= MAX_IMAGE_FILE,
        { message: t("validation.fileTooLarge") }
      ),
    startupChallenges: z.array(z.string()).min(1, t("validation.required")),
    startupObjectives: z.array(z.string()).min(1, t("validation.required")),
    connectionsOnlyOnStartupCountryOrigin: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    valueProposal: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(10, t("validation.required"))),
    shortDescription: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(10, t("validation.required"))),
  });

export const PartnerSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    phone: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    email: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.invalidEmail")),
    position_id: z.string().min(1, t("validation.required")),
    is_founder: z.string().min(1, t("validation.required")),
    dedication_type: z.string().min(1, t("validation.required")),
    percentage_captable: z
      .number()
      .min(0, t("validation.required"))
      .max(100, t("validation.percentageRange")),
    is_first_business: z.string().min(1, t("validation.required")),
    linkedin_lattes: z.string().min(1, t("validation.required")),
    has_experience_or_formation: z.string().min(1, t("validation.required")),
    is_formation_complementary: z.string().min(1, t("validation.required")),
  });

export const TeamDataSchema = (t?: any) =>
  z.object({
    mainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    contactNumber: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    mainResponsibleEmail: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.invalidEmail")),
    employeesQuantity: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    fullTimeEmployeesQuantity: z.coerce
      .number()
      .min(1, t("validation.required")),
    partners: z.array(PartnerSchema(t)).optional(),
  });

export const ProductServiceDataSchema = (t?: any) =>
  z.object({
    startupProductService: z
      .array(z.string())
      .refine((data) => data.length > 0, {
        message: t("validation.selectAtLeastOne"),
      }),
    quantityOdsGoals: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    problemThatIsSolved: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, t("validation.required"))),
    competitors: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, t("validation.required"))),
    competitiveDifferentiator: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, t("validation.required"))),
  });

export const DeepTechDataSchema = () =>
  z.object({
    maturityLevel: z
      .union([z.string(), z.number()])
      .transform((val) => val?.toString() ?? null)
      .nullable()
      .optional(),
    hasPatent: z
      .union([z.string(), z.number()])
      .transform((val) => val?.toString() ?? null)
      .nullable()
      .optional(),
    patentAndCode: z
      .union([z.string(), z.number()])
      .transform((val) => val?.toString() ?? null)
      .nullable()
      .optional(),
  });

export const GovernanceDataSchema = (t?: any) =>
  z.object({
    isStartupOfficiallyRegistered: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    isTherePartnersAgreementSigned: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    haveLegalAdvice: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    haveAccountingConsultancy: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
    relationshipsRegisteredInContract: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),
  });

export const InvestmentSchema = (t?: any) =>
  z
    .object({
      roundInvestmentStartDate: z
        .preprocess(
          (val: any) => (val ? new Date(val) : val),
          z.date({
            required_error: t("validation.required"),
          })
        )
        .optional(),
      roundInvestmentEndDate: z
        .preprocess(
          (val: any) => (val ? new Date(val) : val),
          z.date({
            required_error: t("validation.required"),
          })
        )
        .optional(),
      collectedTotal: z.string({
        required_error: t("validation.required"),
      }),
      equityDistributedPercent: z.string().min(1, {
        message: t("validation.required"),
      }),
      investorsQuantity: z.string().min(1, {
        message: t("validation.required"),
      }),
      investors: z.string({
        required_error: t("validation.required"),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.collectedTotal === "" || data.collectedTotal === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["collectedTotal"],
        });
      }
      if (data.investors === "" || data.investors === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["investors"],
        });
      }
      if (
        data.roundInvestmentStartDate === undefined ||
        data.roundInvestmentStartDate === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["roundInvestmentStartDate"],
        });
      }
      if (
        data.roundInvestmentEndDate === undefined ||
        data.roundInvestmentEndDate === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required"),
          path: ["roundInvestmentEndDate"],
        });
      }
    });

export const FinanceAndMarketDataSchema = (t?: any) =>
  z
    .object({
      payingCustomersQuantity: z
        .string()
        .nullable()
        .transform((v) => (v === null ? "" : v))
        .pipe(z.string().min(1, t("validation.required"))),
      activeCustomersQuantity: z
        .string()
        .nullable()
        .transform((v) => (v === null ? "" : v))
        .pipe(z.string().min(1, t("validation.required"))),
      alreadyEarning: z.boolean().optional(),
      lastRevenue: z.string().optional(),
      lastSixMonthsRevenue: z.string().optional(),
      lastTwelveMonthsRevenue: z.string().optional(),
      saasCurrentRRM: z.string().optional(),
      isThereOpenInvestmentRound: z.boolean().optional(),
      valueCollection: z.string().optional(),
      equityPercentage: z
        .number({ invalid_type_error: t("validation.invalidField") })
        .optional(),
      currentStartupValuation: z.string().optional(),
      roundStartDate: z
        .preprocess((val: any) => (val ? new Date(val) : val), z.date())
        .optional(),
      roundEndDate: z
        .preprocess((val: any) => (val ? new Date(val) : val), z.date())
        .optional(),
      investments: z.array(InvestmentSchema(t)).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.alreadyEarning) {
        if (data.lastRevenue === "" || data.lastRevenue === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["lastRevenue"],
          });
        }
        if (
          data.lastSixMonthsRevenue === "" ||
          data.lastSixMonthsRevenue === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["lastSixMonthsRevenue"],
          });
        }
        if (
          data.lastTwelveMonthsRevenue === "" ||
          data.lastTwelveMonthsRevenue === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["lastTwelveMonthsRevenue"],
          });
        }
        if (data.saasCurrentRRM === "" || data.saasCurrentRRM === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["saasCurrentRRM"],
          });
        }
      }

      if (data.isThereOpenInvestmentRound) {
        if (!data.equityPercentage || data.equityPercentage === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["equityPercentage"],
          });
        }
        if (data.valueCollection === "" || data.valueCollection === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["valueCollection"],
          });
        }
        if (
          data.currentStartupValuation === "" ||
          data.currentStartupValuation === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["currentStartupValuation"],
          });
        }
        if (
          !data.roundStartDate ||
          data.roundStartDate === undefined ||
          data.roundStartDate === null
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["roundStartDate"],
          });
        }
        if (!data.roundEndDate || data.roundEndDate === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.required"),
            path: ["roundEndDate"],
          });
        }
      }
    });

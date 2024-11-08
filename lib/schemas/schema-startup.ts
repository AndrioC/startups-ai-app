import { z } from "zod";
const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_IMAGE_FILE = 1024 * 1024;

export const GeneralDataSchema = () =>
  z.object({
    startupName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, "Este campo é obrigatório!")),
    country: z.string().min(1, "Este campo é obrigatório!"),
    vertical: z.string().min(1, "Este campo é obrigatório!"),
    stateAndCity: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, "Este campo é obrigatório!")),
    operationalStage: z.string().min(1, "Este campo é obrigatório!"),
    businessModel: z.string().min(1, "Este campo é obrigatório!"),
    subscriptionNumber: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, "Este campo é obrigatório!")),
    foundationDate: z.preprocess(
      (val: any) => (val ? new Date(val) : val),
      z.date({
        required_error: "Este campo é obrigatório!",
      })
    ),
    referenceLink: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, "Este campo é obrigatório!")),
    loadPitchDeck: z
      .union([z.string(), z.instanceof(File), z.undefined()])
      .refine(
        (v) => {
          if (typeof v === "string") return v.trim() !== "";
          if (v instanceof File) return v.name !== "" && v.size > 0;
          return false;
        },
        { message: "Este campo é obrigatório!" }
      )
      .refine((file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, {
        message: "Arquivo muito grande!",
      }),
    loadLogo: z
      .union([z.string(), z.instanceof(File), z.undefined()])
      .refine(
        (v) => {
          if (typeof v === "string") return v.trim() !== "";
          if (v instanceof File) return v.name !== "" && v.size > 0;
          return false;
        },
        { message: "Este campo é obrigatório!" }
      )
      .refine(
        (file) => !(file instanceof File) || file.size <= MAX_IMAGE_FILE,
        { message: "Arquivo muito grande!" }
      ),
    startupChallenges: z.array(z.string()).min(1, "Este campo é obrigatório!"),
    startupObjectives: z.array(z.string()).min(1, "Este campo é obrigatório!"),
    connectionsOnlyOnStartupCountryOrigin: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    valueProposal: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(10, "Este campo é obrigatório!")),
    shortDescription: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(10, "Este campo é obrigatório!")),
  });

export const PartnerSchema = z.object({
  name: z
    .string()
    .nullable()
    .transform((v) => (v === null ? "" : v))
    .pipe(z.string().min(1, "Este campo é obrigatório!")),
  phone: z
    .string()
    .nullable()
    .transform((v) => (v === null ? "" : v))
    .pipe(z.string().min(1, "Este campo é obrigatório!")),
  email: z
    .string()
    .min(1, "Este campo é obrigatório!")
    .email("E-mail não é válido!"),
  position_id: z.string().min(1, "Este campo é obrigatório!"),
  is_founder: z.string().min(1, "Este campo é obrigatório!"),
  dedication_type: z.string().min(1, "Este campo é obrigatório!"),
  percentage_captable: z
    .number()
    .min(0, "Este campo é obrigatório!")
    .max(100, "Valor deve ser entre 0 e 100!"),
  is_first_business: z.string().min(1, "Este campo é obrigatório!"),
  linkedin_lattes: z.string().min(1, "Este campo é obrigatório!"),
  has_experience_or_formation: z.string().min(1, "Este campo é obrigatório!"),
  is_formation_complementary: z.string().min(1, "Este campo é obrigatório!"),
});

export const TeamDataSchema = () =>
  z.object({
    mainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    contactNumber: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    mainResponsibleEmail: z
      .string()
      .min(1, "Este campo é obrigatório!")
      .email("E-mail não é válido!"),
    employeesQuantity: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    fullTimeEmployeesQuantity: z.coerce
      .number()
      .min(1, "Este campo é obrigatório!"),
    partners: z.array(PartnerSchema).optional(),
  });

export const ProductServiceDataSchema = () =>
  z.object({
    startupProductService: z
      .array(z.string())
      .refine((data) => data.length > 0, {
        message: "Selecione pelo menos um campo",
      }),
    quantityOdsGoals: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    problemThatIsSolved: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, "Este campo é obrigatório!")),
    competitors: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, "Este campo é obrigatório!")),
    competitiveDifferentiator: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(5, "Este campo é obrigatório!")),
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

export const GovernanceDataSchema = () =>
  z.object({
    isStartupOfficiallyRegistered: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    isTherePartnersAgreementSigned: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    haveLegalAdvice: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    haveAccountingConsultancy: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
    relationshipsRegisteredInContract: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, "Este campo é obrigatório!")),
  });

export const InvestmentSchema = z
  .object({
    roundInvestmentStartDate: z
      .preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Este campo é obrigatório!",
        })
      )
      .optional(),
    roundInvestmentEndDate: z
      .preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Este campo é obrigatório!",
        })
      )
      .optional(),
    collectedTotal: z.string({
      required_error: "Este campo é obrigatório!",
    }),
    equityDistributedPercent: z.string().min(1, {
      message: "Este campo é obrigatório!",
    }),
    investorsQuantity: z.string().min(1, {
      message: "Este campo é obrigatório!",
    }),
    investors: z.string({
      required_error: "Este campo é obrigatório!",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.collectedTotal === "" || data.collectedTotal === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este campo é obrigatórios!",
        path: ["collectedTotal"],
      });
    }
    if (data.investors === "" || data.investors === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este campo é obrigatório!",
        path: ["investors"],
      });
    }
    if (
      data.roundInvestmentStartDate === undefined ||
      data.roundInvestmentStartDate === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este campo é obrigatório!",
        path: ["roundInvestmentStartDate"],
      });
    }
    if (
      data.roundInvestmentEndDate === undefined ||
      data.roundInvestmentEndDate === null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Este campo é obrigatório!",
        path: ["roundInvestmentEndDate"],
      });
    }
  });

export const FinanceAndMarketDataSchema = () =>
  z
    .object({
      payingCustomersQuantity: z
        .string()
        .nullable()
        .transform((v) => (v === null ? "" : v))
        .pipe(z.string().min(1, "Este campo é obrigatório!")),
      activeCustomersQuantity: z
        .string()
        .nullable()
        .transform((v) => (v === null ? "" : v))
        .pipe(z.string().min(1, "Este campo é obrigatório!")),
      alreadyEarning: z.boolean().optional(),
      lastRevenue: z.string().optional(),
      lastSixMonthsRevenue: z.string().optional(),
      lastTwelveMonthsRevenue: z.string().optional(),
      saasCurrentRRM: z.string().optional(),
      isThereOpenInvestmentRound: z.boolean().optional(),
      valueCollection: z.string().optional(),
      equityPercentage: z
        .number({ invalid_type_error: "Campo inválido!" })
        .optional(),
      currentStartupValuation: z.string().optional(),
      roundStartDate: z
        .preprocess((val: any) => (val ? new Date(val) : val), z.date())
        .optional(),
      roundEndDate: z
        .preprocess((val: any) => (val ? new Date(val) : val), z.date())
        .optional(),
      investments: z.array(InvestmentSchema).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.alreadyEarning) {
        if (data.lastRevenue === "" || data.lastRevenue === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["lastRevenue"],
          });
        }
        if (
          data.lastSixMonthsRevenue === "" ||
          data.lastSixMonthsRevenue === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["lastSixMonthsRevenue"],
          });
        }
        if (
          data.lastTwelveMonthsRevenue === "" ||
          data.lastTwelveMonthsRevenue === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["lastTwelveMonthsRevenue"],
          });
        }
        if (data.saasCurrentRRM === "" || data.saasCurrentRRM === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["saasCurrentRRM"],
          });
        }
      }

      if (data.isThereOpenInvestmentRound) {
        if (!data.equityPercentage || data.equityPercentage === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["equityPercentage"],
          });
        }
        if (data.valueCollection === "" || data.valueCollection === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["valueCollection"],
          });
        }
        if (
          data.currentStartupValuation === "" ||
          data.currentStartupValuation === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
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
            message: "Este campo é obrigatório!",
            path: ["roundStartDate"],
          });
        }
        if (!data.roundEndDate || data.roundEndDate === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório!",
            path: ["roundEndDate"],
          });
        }
      }
    });

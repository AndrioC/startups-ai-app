import { z } from "zod";

const MAX_IMAGE_FILE = 1024 * 1024;

export const EnterpriseCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
});

export const EnterpriseObjectivesSchema = z.object({
  id: z.number(),
  code: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
});

export const EnterpriseActivityAreaCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
});

export const EnterpriseCollegeActivityAreaCategorySchema = z.object({
  id: z.number(),
  code: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
});

export const EnterpriseActivityAreaSchema = z.object({
  id: z.number(),
  code: z.string(),
  name_en: z.string(),
  name_pt: z.string(),
  enterprise_activity_area_category_id: z.number(),
  enterprise_activity_area_category: EnterpriseActivityAreaCategorySchema,
});

export const EnterpriseSchema = (t?: any) =>
  z.object({
    id: z.number().optional(),
    name: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, t("validation.required"))),
    countryId: z
      .number()
      .or(z.string().transform((val) => Number(val)))
      .refine((val) => val > 0, t("validation.required")),

    stateCity: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, t("validation.required"))),
    subscriptionNumber: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v)),
    fullAddress: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    activityAreas: z.preprocess(
      (val) => (typeof val === "string" ? [Number(val)] : val),
      z.array(z.number()).default([])
    ),
    website: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),

    mainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(3, t("validation.required"))),
    mainResponsibleEmail: z
      .string()
      .email(t("validation.invalidEmail"))
      .min(1, t("validation.required")),
    mainResponsiblePhone: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(8, t("validation.required"))),

    enterpriseOrganizationType: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    enterpriseEmployeesQuantity: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => {
        if (val === null || val === "") return undefined;
        return typeof val === "string" ? Number(val) : val;
      })
      .optional(),
    enterpriseSocialCapital: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => {
        if (val === null || val === "") return undefined;
        return typeof val === "string" ? Number(val) : val;
      })
      .optional(),
    enterpriseMainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    enterpriseProducts: z
      .string()
      .min(1, { message: t("validation.required") })
      .nullable()
      .transform((v) => (v === null ? "" : v)),
    enterpriseCertifications: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),

    governmentOrganizationType: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    governmentCoverageArea: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    governmentBusinessHour: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    governmentMainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),

    collegeOrganizationTypeId: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => {
        if (val === null || val === "") return undefined;
        return typeof val === "string" ? Number(val) : val;
      })
      .optional(),
    collegePublicPrivate: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    collegeEnrolledStudentsQuantity: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => {
        if (val === null || val === "") return undefined;
        return typeof val === "string" ? Number(val) : val;
      })
      .optional(),
    collegeMainResponsibleName: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .optional(),
    collegeActivityArea: z.preprocess(
      (val) => (typeof val === "string" ? [Number(val)] : val),
      z.array(z.number()).default([])
    ),

    fullyDescription: z
      .string()
      .nullable()
      .transform((v) => (v === null ? "" : v))
      .pipe(z.string().min(1, t("validation.required"))),

    enterpriseObjectives: z.array(z.string()).optional(),

    logoImage: z
      .union([z.string(), z.instanceof(File), z.undefined()])
      .optional()
      .refine(
        (v) => {
          if (typeof v === "string") return true;
          if (v instanceof File)
            return v.name !== "" && v.size <= MAX_IMAGE_FILE;
          return true;
        },
        { message: t("validation.required") }
      ),
    fullyCompletedProfile: z.boolean().default(false),
    profileFilledPercentage: z.number().default(0),
    profileUpdated: z.boolean().default(false),

    plan: z.string().default("free"),
    isDeleted: z.boolean().default(false),
    isApproved: z.boolean().default(false),
    isBlocked: z.boolean().default(false),
    wasProcessed: z.boolean().default(false),
    freeSubscriptionExpiresAt: z.date().optional(),

    enterpriseActivityAreas: z.array(EnterpriseActivityAreaSchema).optional(),
  });

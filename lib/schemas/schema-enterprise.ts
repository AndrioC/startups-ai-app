import { EnterpriseCategoryType } from "@prisma/client";
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

export const EnterpriseSchema = (
  t?: any,
  enterpriseCategory?: EnterpriseCategoryType
) =>
  z.object({
    id: z.number().optional(),

    name: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .trim()
        .min(3, { message: t("validation.required") })
    ),

    countryId: z.preprocess(
      (val) => val ?? "",
      z
        .number({
          required_error: t("validation.required"),
          invalid_type_error: t("validation.required"),
        })
        .refine((val) => val > 0, { message: t("validation.required") })
    ),

    stateCity: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .trim()
        .min(3, { message: t("validation.required") })
    ),

    subscriptionNumber: z.preprocess((val) => val ?? "", z.string().optional()),

    fullAddress: z.preprocess((val) => val ?? "", z.string().optional()),

    website: z.preprocess((val) => val ?? "", z.string().optional()),

    activityAreas: z.preprocess(
      (val) => (typeof val === "string" ? [Number(val)] : val),
      z.array(z.number()).default([])
    ),

    mainResponsibleName: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .trim()
        .min(3, { message: t("validation.required") })
    ),

    mainResponsibleEmail: z.preprocess(
      (val) => val ?? "",
      z.string().email({ message: t("validation.invalidEmail") })
    ),

    mainResponsiblePhone: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .trim()
        .min(8, { message: t("validation.required") })
    ),

    enterpriseOrganizationType: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    enterpriseEmployeesQuantity: z.preprocess((val) => {
      if (val === null || val === "") return undefined;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().optional()),

    enterpriseSocialCapital: z.preprocess((val) => {
      if (val === null || val === "") return undefined;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().optional()),

    enterpriseMainResponsibleName: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    enterpriseProducts: z.preprocess(
      (val) => val ?? "",
      enterpriseCategory === EnterpriseCategoryType.TRADITIONAL_COMPANY
        ? z
            .string()
            .trim()
            .min(1, { message: t("validation.required") })
        : z.string().optional()
    ),

    enterpriseCertifications: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    governmentOrganizationType: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    governmentCoverageArea: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    governmentBusinessHour: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    governmentMainResponsibleName: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    collegeOrganizationTypeId: z.preprocess(
      (val) => {
        if (val === null || val === "") return undefined;
        return typeof val === "string" ? Number(val) : val;
      },
      enterpriseCategory === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
        ? z
            .number({
              required_error: t("validation.required"),
              invalid_type_error: t("validation.required"),
            })
            .refine((val) => val > 0, { message: t("validation.required") })
        : z.number().optional()
    ),

    collegePublicPrivate: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    collegeEnrolledStudentsQuantity: z.preprocess((val) => {
      if (val === null || val === "") return undefined;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().optional()),

    collegeMainResponsibleName: z.preprocess(
      (val) => val ?? "",
      z.string().optional()
    ),

    collegeActivityArea: z.preprocess(
      (val) => (typeof val === "string" ? [Number(val)] : val),
      enterpriseCategory === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
        ? z.array(z.number()).min(1, { message: t("validation.required") })
        : z.array(z.number()).optional()
    ),

    fullyDescription: z.preprocess(
      (val) => val ?? "",
      z
        .string()
        .trim()
        .min(1, { message: t("validation.required") })
    ),

    enterpriseObjectives: z.array(z.string()).optional(),

    logoImage: z.preprocess(
      (val) => val,
      z
        .union([
          z
            .string()
            .refine((v) => v && v.trim() !== "", {
              message: t("validation.required"),
            }),
          z
            .instanceof(File)
            .refine((file) => file.name !== "" && file.size > 0, {
              message: t("validation.required"),
            }),
        ])
        .refine(
          (file) => {
            if (file instanceof File) {
              return file.size <= MAX_IMAGE_FILE;
            }
            return true;
          },
          { message: t("validation.fileTooLarge") }
        )
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

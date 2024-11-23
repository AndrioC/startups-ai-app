import { z } from "zod";

export const LoginSchema = (t: any) => {
  return z.object({
    email: z
      .string()
      .min(1, t("validation.required"))
      .email(t("validation.invalidEmail")),
    password: z.string().min(6, t("validation.minPassword")),
    slug: z.string(),
  });
};

export const LoginSchemaServer = (t: any) => {
  return z.object({
    email: z
      .string()
      .min(1, t("auth.validation.required"))
      .email(t("auth.validation.invalidEmail")),
    password: z.string().min(6, t("auth.validation.minPassword")),
    slug: z.string(),
  });
};

export const patchStartupSchema = z.object({
  is_approved: z.boolean().optional(),
});

export const patchExpertSchema = z.object({
  is_approved: z.boolean().optional(),
});

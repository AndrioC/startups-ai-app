import { z } from "zod";

export const getRegisterValidationMessages = (t: any) => ({
  required: t("validation.required"),
  minNameLength: t("validation.minNameLength"),
  invalidEmail: t("validation.invalidEmail"),
  minPasswordLength: t("validation.minPasswordLength"),
  minConfirmPasswordLength: t("validation.minConfirmPasswordLength"),
  mustAcceptTerms: t("validation.mustAcceptTerms"),
  passwordsNotMatch: t("validation.passwordsNotMatch"),
});

export const RegisterSchema = (t: any) => {
  const messages = getRegisterValidationMessages(t);

  return z
    .object({
      registerName: z.string().min(5, messages.minNameLength),
      registerEmail: z.string().email(messages.invalidEmail),
      registerPassword: z.string().min(6, messages.minPasswordLength),
      registerConfirmPassword: z
        .string()
        .min(6, messages.minConfirmPasswordLength),
      registerUserType: z.string().min(1, messages.required),
      enterpriseCategory: z.string().optional(), // Make it optional initially
      registerUserTerms: z.boolean().refine((val) => val === true, {
        message: messages.mustAcceptTerms,
      }),
    })
    .refine((data) => data.registerPassword === data.registerConfirmPassword, {
      path: ["registerConfirmPassword"],
      message: messages.passwordsNotMatch,
    })
    .refine(
      (data) => {
        if (
          data.registerUserType === "ENTERPRISE" &&
          (!data.enterpriseCategory || data.enterpriseCategory.length === 0)
        ) {
          return false;
        }
        return true;
      },
      {
        message: messages.required,
        path: ["enterpriseCategory"],
      }
    );
};

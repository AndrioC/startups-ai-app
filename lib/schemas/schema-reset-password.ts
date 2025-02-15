import { z } from "zod";

export const ResetPasswordSchema = (t: any) =>
  z
    .object({
      newPassword: z.string().min(6, t("newPasswordMin")),
      confirmPassword: z.string().min(6, t("confirmPasswordMin")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    });

import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const patchStartupSchema = z.object({
  is_approved: z.boolean().optional(),
});

export const patchExpertSchema = z.object({
  is_approved: z.boolean().optional(),
});

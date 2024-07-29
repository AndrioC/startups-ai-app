import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Este campo é obrigatório!")
    .email("E-mail não é válido!"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres!"),
  slug: z.string(),
});

export const patchStartupSchema = z.object({
  is_approved: z.boolean().optional(),
});

export const patchExpertSchema = z.object({
  is_approved: z.boolean().optional(),
});

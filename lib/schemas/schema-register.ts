import { z } from "zod";

export const RegisterSchema = () =>
  z
    .object({
      registerName: z
        .string()
        .min(5, "O nome deve ter pelo menos 5 caracteres!"),
      registerEmail: z
        .string()
        .email("Por favor, insira um endereço de e-mail válido."),
      registerPassword: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres!"),
      registerConfirmPassword: z
        .string()
        .min(6, "A confirmação da senha deve ter pelo menos 6 caracteres!"),
      registerUserType: z.string().min(1, "Campo obrigatório!"),
      registerUserTerms: z.boolean().refine((val) => val === true, {
        message: "Você deve aceitar os termos.",
      }),
    })
    .refine((data) => data.registerPassword === data.registerConfirmPassword, {
      path: ["registerConfirmPassword"],
      message: "As senhas não são identicas",
    });

import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export const CompanySchema = () =>
  z.object({
    companyName: z.string().min(1, "Este campo é obrigatório!"),
    createdAt: z.preprocess(
      (val: any) => (val ? new Date(val) : val),
      z.date({
        required_error: "Este campo é obrigatório!",
      })
    ),
    logo: z.instanceof(File).optional(),
    logoSidebar: z.instanceof(File).optional(),
    isPaying: z.boolean(),
    users: z.array(UserSchema),
  });

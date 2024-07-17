import { z } from "zod";

export const ProgramSchema = () =>
  z
    .object({
      programName: z.string().min(1, "Este campo é obrigatório!"),
      startDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Este campo é obrigatório!",
        })
      ),
      endDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Este campo é obrigatório!",
        })
      ),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "A data de término deve ser posterior à data de início!",
      path: ["endDate"],
    });

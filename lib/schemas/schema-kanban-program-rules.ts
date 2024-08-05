import * as z from "zod";

export const KanbanProgramRulesSchema = () =>
  z.object({
    kanban_id: z
      .number({
        required_error: "Por favor, selecione uma lista",
        invalid_type_error: "Por favor, selecione uma lista válida",
      })
      .optional(),
    program_id: z.number(),
    rules: z.array(
      z.object({
        key: z.string(),
        rule: z.string().min(1, "Campo obrigatório"),
        comparationType: z.string().min(1, "Campo obrigatório"),
        value: z
          .union([
            z.string().min(1, "Campo obrigatório"),
            z.array(z.string().min(1, "Campo obrigatório")),
            z.date(),
            z.number().transform((val) => val.toString()),
          ])
          .refine(
            (val) => {
              if (val instanceof Date) return true;
              return Array.isArray(val) ? val.length > 0 : val.length > 0;
            },
            {
              message: "Campo obrigatório",
            }
          ),
      })
    ),
  });

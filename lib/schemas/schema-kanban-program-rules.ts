import * as z from "zod";

export const KanbanProgramRulesSchema = (t: any) =>
  z.object({
    kanban_id: z
      .number({
        required_error: t("validation.selectList"),
        invalid_type_error: t("validation.selectValidList"),
      })
      .optional(),
    program_id: z.number(),
    rules: z.array(
      z.object({
        key: z.string(),
        rule: z.string().min(1, t("validation.required")),
        comparationType: z.string().min(1, t("validation.required")),
        value: z
          .union([
            z.string().min(1, t("validation.required")),
            z.array(z.string().min(1, t("validation.required"))),
            z.date(),
            z.number().transform((val) => val.toString()),
          ])
          .refine(
            (val) => {
              if (val instanceof Date) return true;
              return Array.isArray(val) ? val.length > 0 : val.length > 0;
            },
            {
              message: t("validation.required"),
            }
          ),
      })
    ),
  });

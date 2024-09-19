import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

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
      description: z.string().min(1, "Este campo é obrigatório!"),
      editalFile: z.preprocess(
        (val) => {
          if (val instanceof File) return val;
          return undefined;
        },
        z
          .instanceof(File)
          .optional()
          .nullable()
          .refine(
            (file) => {
              if (!file) return true;
              return file.size <= MAX_FILE_SIZE;
            },
            {
              message: "Arquivo muito grande!",
            }
          )
      ),
      editalFileUrl: z.string().nullable().optional(),
      removeExistingFile: z.boolean().optional().default(false),
      isPublished: z.boolean().default(false),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "A data de término deve ser posterior à data de início!",
      path: ["endDate"],
    });

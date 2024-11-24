import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const ProgramSchema = (t: any) =>
  z
    .object({
      programName: z.string().min(1, t("validation.required")),
      startDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: t("validation.required"),
        })
      ),
      endDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: t("validation.required"),
        })
      ),
      description: z.string().min(1, t("validation.required")),
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
              message: t("validation.fileTooLarge"),
            }
          )
      ),
      editalFileUrl: z.string().nullable().optional(),
      removeExistingFile: z.boolean().optional().default(false),
      isPublished: z.boolean().default(false),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: t("validation.endDateAfterStartDate"),
      path: ["endDate"],
    });

export const ProgramSchemaServer = () =>
  z
    .object({
      programName: z.string().min(1, "Required field!"),
      startDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Required field!",
        })
      ),
      endDate: z.preprocess(
        (val: any) => (val ? new Date(val) : val),
        z.date({
          required_error: "Required field!",
        })
      ),
      description: z.string().min(1, "Required field!"),
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
              message: "File too large",
            }
          )
      ),
      editalFileUrl: z.string().nullable().optional(),
      removeExistingFile: z.boolean().optional().default(false),
      isPublished: z.boolean().default(false),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "The end date must be after the start date!",
      path: ["endDate"],
    });

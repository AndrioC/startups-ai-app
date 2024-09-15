import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const ExternalPageSettingsSchema = () =>
  z
    .object({
      loadBanner: z.union([
        z
          .instanceof(File, {
            message: "Um arquivo de imagem é obrigatório",
          })
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "O tamanho máximo do arquivo é 2MB"
          )
          .refine(
            (file) => file.type.startsWith("image/"),
            "O arquivo deve ser uma imagem"
          ),
        z.string().optional(),
      ]),
      bannerPhrase: z.string().max(40, "Máximo de 40 caracteres").optional(),
      showLearnMore: z.boolean().optional(),
      learnMoreText: z.string().max(15, "Máximo de 15 caracteres").optional(),
      learnMoreLink: z.string().optional(),
      pageTitle: z.string().max(30, "Máximo de 30 caracteres").optional(),
      linkVideo: z
        .string()
        .refine(
          (value) => {
            if (value.trim() === "") return true;
            return isValidURL(value);
          },
          {
            message: "URL do vídeo inválida",
          }
        )
        .optional(),
      freeText: z
        .string()
        .nullable()
        .optional()
        .transform((value) => {
          const trimmed = value?.trim() || null;
          return trimmed === "" || trimmed === "<p></p>" ? null : trimmed;
        })
        .refine(
          (value) => value === null || value.length >= 50,
          "O texto livre deve ter no mínimo 50 caracteres quando preenchido"
        ),
      enabled_tabs: z
        .array(
          z.object({
            tab_number: z.number(),
            is_enabled: z.boolean(),
            tab_card: z
              .object({
                title: z
                  .string()
                  .nullish()
                  .refine(
                    (val) =>
                      val !== null && val !== undefined && val.trim() !== "",
                    {
                      message: "O título é obrigatório",
                    }
                  )
                  .transform((val) => val?.trim())
                  .pipe(z.string().max(30, "Máximo de 30 caracteres")),
                buttonText: z
                  .string()
                  .nullish()
                  .refine(
                    (val) =>
                      val !== null && val !== undefined && val.trim() !== "",
                    {
                      message: "O texto do botão é obrigatório",
                    }
                  )
                  .transform((val) => val?.trim())
                  .pipe(z.string().max(18, "Máximo de 18 caracteres")),
                buttonLink: z
                  .string()
                  .nullish()
                  .refine(
                    (val) =>
                      val !== null && val !== undefined && val.trim() !== "",
                    {
                      message: "O link do botão é obrigatório",
                    }
                  )
                  .transform((val) => val?.trim())
                  .pipe(z.string().url("URL inválida")),
                benefits: z
                  .array(
                    z
                      .string()
                      .nullish()
                      .refine(
                        (val) =>
                          val !== null &&
                          val !== undefined &&
                          val.trim() !== "",
                        {
                          message: "O benefício é obrigatório",
                        }
                      )
                      .transform((val) => val?.trim())
                      .pipe(z.string().max(30, "Máximo de 30 caracteres"))
                  )
                  .length(3, "Deve haver exatamente 3 benefícios"),
              })
              .nullable(),
          })
        )
        .superRefine((tabs, ctx) => {
          tabs.forEach((tab, index) => {
            if (tab.is_enabled) {
              if (!tab.tab_card) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "O card é obrigatório quando a aba está habilitada",
                  path: [index, "tab_card"],
                });
              }
            } else {
              if (tab.tab_card !== null) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    "O card deve ser nulo quando a aba está desabilitada",
                  path: [index, "tab_card"],
                });
              }
            }
          });
        }),
    })
    .superRefine((data, ctx) => {
      if (data.showLearnMore) {
        if (!data.learnMoreText || data.learnMoreText.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "O texto 'Saiba mais' é obrigatório quando 'Mostrar Saiba mais' está ativado",
            path: ["learnMoreText"],
          });
        }
        if (!data.learnMoreLink || data.learnMoreLink.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "O link 'Saiba mais' é obrigatório quando 'Mostrar Saiba mais' está ativado",
            path: ["learnMoreLink"],
          });
        } else if (!isValidURL(data.learnMoreLink)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "URL inválida",
            path: ["learnMoreLink"],
          });
        }
      }
    });

function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

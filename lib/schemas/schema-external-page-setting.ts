import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const ExternalPageSettingsSchema = (enabledTabs: boolean[]) =>
  z.object({
    loadBanner: z
      .instanceof(File, {
        message: "Um arquivo de imagem é obrigatório",
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        `O tamanho máximo do arquivo é 2MB`
      )
      .refine(
        (file) => file.type.startsWith("image/"),
        `O arquivo deve ser uma imagem`
      ),
    bannerPhrase: z.string().max(40, "Máximo de 40 caracteres").optional(),
    showLearnMore: z.boolean().optional(),
    learnMoreText: z.string().max(15, "Máximo de 15 caracteres").optional(),
    learnMoreLink: z.string().url("URL inválida").optional(),
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
        if (value === null || value === undefined) return null;
        const trimmed = value.trim();
        if (trimmed === "" || trimmed === "<p></p>") return null;
        return trimmed;
      })
      .refine(
        (value) => {
          if (value === null) return true;
          return value.length >= 50;
        },
        {
          message:
            "O texto livre deve ter no mínimo 50 caracteres quando preenchido",
        }
      ),
    tabs: z
      .array(
        z.object({
          title: z.string().max(30, "Máximo de 30 caracteres"),
          buttonText: z.string().max(18, "Máximo de 18 caracteres"),
          buttonLink: z.string(),
          benefits: z
            .array(z.string().max(30, "Máximo de 30 caracteres"))
            .length(3, "Deve haver exatamente 3 benefícios"),
        })
      )
      .superRefine((tabs, ctx) => {
        tabs.forEach((tab, index) => {
          if (enabledTabs[index]) {
            if (tab.title.trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O título é obrigatório",
                path: [index, "title"],
              });
            }
            if (tab.buttonText.trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O texto do botão é obrigatório",
                path: [index, "buttonText"],
              });
            }
            if (tab.buttonLink.trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O link do botão é obrigatório",
                path: [index, "buttonLink"],
              });
            } else if (!isValidURL(tab.buttonLink)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "URL inválida",
                path: [index, "buttonLink"],
              });
            }
            tab.benefits.forEach((benefit, benefitIndex) => {
              if (benefit.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "O benefício é obrigatório",
                  path: [index, "benefits", benefitIndex],
                });
              }
            });
          }
        });
      }),
  });

function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

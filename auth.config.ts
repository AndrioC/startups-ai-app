import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createTranslator } from "next-intl";

import { getUserByEmail } from "@/data/user";
import { LoginSchemaServer } from "@/lib/schemas/schema";

const locales = ["pt-br", "en"];

async function getServerTranslations() {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "pt-br";

  const validLocale = locales.includes(locale) ? locale : "pt-br";
  const messages = (await import(`/translation/${validLocale}.json`)).default;

  return createTranslator({ locale: validLocale, messages });
}

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const t = await getServerTranslations();
          const validatedFields = LoginSchemaServer(t).safeParse(credentials);

          if (validatedFields.success) {
            const { email, password, slug } = validatedFields.data;
            const user = await getUserByEmail(email, slug);

            if (!user || !user.hashed_password) return null;

            const passwordsMatch = await bcryptjs.compare(
              password,
              user.hashed_password
            );

            if (passwordsMatch) {
              let actor_id;
              switch (user.type) {
                case "STARTUP":
                  actor_id = user?.startup_id;
                  break;
                case "INVESTOR":
                  actor_id = user?.investor_id;
                  break;
                case "MENTOR":
                  actor_id = user?.expert_id;
                  break;
                default:
                  actor_id = null;
              }

              return {
                id: String(user.id),
                name: user.name,
                email: user.email,
                organization_id: user.organization_id!,
                type: user.type!,
                isSAI: user.type === "SAI",
                isAdmin: user.type === "ADMIN",
                isInvestor: user.type === "INVESTOR",
                isMentor: user.type === "MENTOR",
                isStartup: user.type === "STARTUP",
                actor_id: actor_id ? actor_id : null,
                language: user.language,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

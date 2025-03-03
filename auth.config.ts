import { UserType } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
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
                case UserType.STARTUP:
                  actor_id = user?.startup_id;
                  break;
                case UserType.INVESTOR:
                  actor_id = user?.investor_id;
                  break;
                case UserType.MENTOR:
                  actor_id = user?.expert_id;
                  break;
                case UserType.ENTERPRISE:
                  actor_id = user?.enterprise_id;
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
                isSAI: user.type === UserType.SAI,
                isAdmin: user.type === UserType.ADMIN,
                isInvestor: user.type === UserType.INVESTOR,
                isMentor: user.type === UserType.MENTOR,
                isStartup: user.type === UserType.STARTUP,
                isEnterprise: user.type === UserType.ENTERPRISE,
                actor_id: actor_id ? actor_id : null,
                language: user.language,
                enterprise_category_code:
                  user.type === UserType.ENTERPRISE
                    ? user.enterprise?.enterprise_category?.code
                    : null,
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

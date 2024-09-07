import bcryptjs from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/schemas/schema";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
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
                actor_id = user.startup_id;
                break;
              case "INVESTOR":
                actor_id = user.investor_id;
                break;
              case "MENTOR":
                actor_id = user.expert_id;
                break;
              default:
                actor_id = null;
            }
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              organization_id: user.organization_id,
              type: user.type,
              isSGL: user.type === "SGL",
              isAdmin: user.type === "ADMIN",
              isInvestor: user.type === "INVESTOR",
              isMentor: user.type === "MENTOR",
              isStartup: user.type === "STARTUP",
              actor_id: actor_id ? actor_id : null,
            };
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

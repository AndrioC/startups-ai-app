import bcryptjs from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schemas";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.hashed_password) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.hashed_password
          );

          if (passwordsMatch)
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              organization_id: user.organization_id,
            };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

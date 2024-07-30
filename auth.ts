import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

import prisma from "./prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: Number(user.id) },
        data: { email_verified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      //Prevent sign in without email verification
      const existingUser = await getUserById(Number(user.id));

      if (!existingUser?.email_verified) return false;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.organization_id = token.organization_id!;
        session.user.type = token.type!;

        session.user.isAdmin = token.type === "ADMIN";
        session.user.isInvestor = token.type === "INVESTOR";
        session.user.isMentor = token.type === "MENTOR";
        session.user.isStartup = token.type === "STARTUP";
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(Number(token.sub));

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.organization_id = existingUser.organization_id;
      token.type = existingUser.type;

      token.isAdmin = token.type === "ADMIN";
      token.isInvestor = token.type === "INVESTOR";
      token.isMentor = token.type === "MENTOR";
      token.isStartup = token.type === "STARTUP";
      return token;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  ...authConfig,
});

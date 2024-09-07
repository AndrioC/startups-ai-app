import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

import prisma from "./prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME =
  process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME;

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

        session.user.isSGL = token.type === "SGL";
        session.user.isAdmin = token.type === "ADMIN";
        session.user.isInvestor = token.type === "INVESTOR";
        session.user.isMentor = token.type === "MENTOR";
        session.user.isStartup = token.type === "STARTUP";

        session.user.actor_id = token.actor_id;

        session.user.logo_img = token.logo_img
          ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${token.logo_img}`
          : null;
        session.user.logo_sidebar = token.logo_sidebar
          ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${token.logo_sidebar}`
          : null;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(Number(token.sub));

      if (!existingUser) return token;

      const organization = await prisma.organizations.findFirst({
        where: { id: Number(existingUser.organization_id) },
      });

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.organization_id = existingUser.organization_id;
      token.type = existingUser.type;

      token.isSGL = token.type === "SGL";
      token.isAdmin = existingUser.type === "ADMIN";
      token.isInvestor = existingUser.type === "INVESTOR";
      token.isMentor = existingUser.type === "MENTOR";
      token.isStartup = existingUser.type === "STARTUP";

      token.logo_img = organization?.logo_img;
      token.logo_sidebar = organization?.logo_sidebar;

      switch (existingUser.type) {
        case "STARTUP":
          token.actor_id = existingUser.startup_id
            ? Number(existingUser.startup_id)
            : null;
          break;
        case "INVESTOR":
          token.actor_id = existingUser.investor_id
            ? Number(existingUser.investor_id)
            : null;
          break;
        case "MENTOR":
          token.actor_id = existingUser.expert_id
            ? Number(existingUser.expert_id)
            : null;
          break;
        default:
          token.actor_id = null;
      }

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

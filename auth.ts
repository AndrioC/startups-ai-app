import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserType } from "@prisma/client";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";

import { getUserByEmailAndSlug } from "./actions/get-user-by-email-and-slug";
import prisma from "./prisma/client";

const S3_ORGANIZATIONS_IMGS_BUCKET_NAME =
  process.env.S3_ORGANIZATIONS_IMGS_BUCKET_NAME;

const S3_USERS_IMGS_BUCKET_NAME = process.env.S3_USERS_IMGS_BUCKET_NAME;

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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      console.log("Sign In Callback - User:", user);
      console.log("Sign In Callback - Account:", account);
      console.log("Sign In Callback - Profile:", profile);
      if (account?.provider === "google") {
        const subdomain = account.subdomain as string;

        if (!subdomain) {
          throw new Error("Subdomain not provided");
        }

        const existingUser = await getUserByEmailAndSlug(
          profile?.email!,
          subdomain
        );

        if (existingUser) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: String(account.session_state),
            },
          });

          return true;
        }
      }

      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(
        Number(user.id),
        user.organization_id
      );

      if (!existingUser?.email_verified) return false;

      if (existingUser.is_blocked) {
        throw new Error(
          "Conta bloqueada. Entre em contato com o administrador."
        );
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        const existingUser = await getUserById(
          Number(token.sub),
          token.organization_id
        );
        if (existingUser?.is_blocked) {
          throw new Error(
            "Conta bloqueada. Entre em contato com o administrador."
          );
        }

        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.organization_id = token.organization_id!;
        session.user.type = token.type!;
        session.user.user_logo_img = token.user_logo_img
          ? `https://${S3_USERS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${token.user_logo_img}`
          : null;

        session.user.isSAI = token.type === UserType.SAI;
        session.user.isAdmin = token.type === UserType.ADMIN;
        session.user.isInvestor = token.type === UserType.INVESTOR;
        session.user.isMentor = token.type === UserType.MENTOR;
        session.user.isStartup = token.type === UserType.STARTUP;
        session.user.isEnterprise = token.type === UserType.ENTERPRISE;
        session.user.enterprise_category_code = token.enterprise_category_code;

        session.user.actor_id = token.actor_id;

        session.user.logo_img = token.logo_img
          ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${token.logo_img}`
          : null;
        session.user.logo_sidebar = token.logo_sidebar
          ? `https://${S3_ORGANIZATIONS_IMGS_BUCKET_NAME}.s3.amazonaws.com/${token.logo_sidebar}`
          : null;

        session.user.last_access = token?.last_access;

        session.user.language = token?.language;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          organization_id: user.organization_id,
          type: user.type,
          user_logo_img: user.logo_img,
        };
      }

      if (token.id && token.organization_id) {
        const existingUser = await getUserById(
          Number(token.id),
          Number(token.organization_id)
        );

        if (!existingUser) return token;

        if (existingUser.is_blocked) {
          throw new Error(
            "Conta bloqueada. Entre em contato com o administrador."
          );
        }

        const organization = await prisma.organizations.findFirst({
          where: { id: Number(existingUser.organization_id) },
        });

        const penultimateAccess = await prisma.user_access.findMany({
          where: { user_id: Number(token.id) },
          orderBy: { timestamp: "desc" },
          take: 2,
          skip: 1,
          select: { timestamp: true },
        });

        token.name = existingUser.name;
        token.email = existingUser.email;
        token.type = existingUser.type!;
        token.user_logo_img = existingUser.logo_img;

        token.isSAI = existingUser.type === UserType.SAI;
        token.isAdmin = existingUser.type === UserType.ADMIN;
        token.isInvestor = existingUser.type === UserType.INVESTOR;
        token.isMentor = existingUser.type === UserType.MENTOR;
        token.isStartup = existingUser.type === UserType.STARTUP;
        token.isEnterprise = existingUser.type === UserType.ENTERPRISE;
        token.enterprise_category_code =
          existingUser.enterprise?.enterprise_category?.code;

        token.logo_img = organization?.logo_img;
        token.logo_sidebar = organization?.logo_sidebar;

        token.last_access = penultimateAccess[0]?.timestamp || null;

        token.language = existingUser.language;

        switch (existingUser.type) {
          case UserType.STARTUP:
            token.actor_id = existingUser.startup_id
              ? Number(existingUser.startup_id)
              : null;
            break;
          case UserType.INVESTOR:
            token.actor_id = existingUser.investor_id
              ? Number(existingUser.investor_id)
              : null;
            break;
          case UserType.MENTOR:
            token.actor_id = existingUser.expert_id
              ? Number(existingUser.expert_id)
              : null;
            break;
          case UserType.ENTERPRISE:
            token.actor_id = existingUser.enterprise_id
              ? Number(existingUser.enterprise_id)
              : null;
            break;
          default:
            token.actor_id = null;
        }
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

import { EnterpriseCategoryType, UserType } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isSAI: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    isEnterprise: boolean;
    actor_id?: number | null;
    user_logo_img?: string | null;
    logo_img?: string | null;
    logo_sidebar?: string | null;
    last_access?: Date | null;
    language?: string;
    enterprise_category_code?: EnterpriseCategoryType | null;
  }

  interface User {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isSAI: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    isEnterprise: boolean;
    actor_id?: number | null;
    user_logo_img?: string | null;
    logo_img?: string | null;
    logo_sidebar?: string | null;
    last_access?: Date | null;
    language?: string;
    enterprise_category_code?: EnterpriseCategoryType | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isSAI: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    isEnterprise: boolean;
    actor_id?: number | null;
    user_logo_img?: string | null;
    logo_img?: string | null;
    logo_sidebar?: string | null;
    last_access?: Date | null;
    language?: string;
    enterprise_category_code?: EnterpriseCategoryType | null;
  }
}

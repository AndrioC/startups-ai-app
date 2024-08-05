import { UserType } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    actor_id?: number | null;
  }

  interface User {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    actor_id?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organization_id: number;
    type: UserType;
    isAdmin: boolean;
    isInvestor: boolean;
    isMentor: boolean;
    isStartup: boolean;
    actor_id?: number | null;
  }
}

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    organization_id: number;
  }

  interface User {
    organization_id: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    organization_id: number;
  }
}

import { UserType } from "@prisma/client";

import prisma from "@/prisma/client";

export const getUserByEmail = async (email: string, slug: string) => {
  try {
    const type = slug.includes("admin");
    const whereOrganization = type ? { slug_admin: slug } : { slug };
    const organization = await prisma.organizations.findFirst({
      where: whereOrganization,
    });

    const whereUser = type
      ? { email, organization_id: organization?.id, type: UserType.ADMIN }
      : { email, organization_id: organization?.id };

    const user = await prisma.user.findFirst({
      where: whereUser,
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};

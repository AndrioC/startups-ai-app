import prisma from "@/prisma/client";

export const getUserByEmail = async (email: string, slug: string) => {
  try {
    const type = slug.includes("admin");
    const whereOrganization = type ? { slug_admin: slug } : { slug };
    const organization = await prisma.organizations.findFirst({
      where: whereOrganization,
    });

    const whereUser = { email, organization_id: organization?.id };

    const userOrganization = await prisma.user_organizations.findFirst({
      where: {
        organization_id: whereUser.organization_id,
        user: {
          email,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            type: true,
            name: true,
            logo_img: true,
            email: true,
            accepted_terms: true,
            is_blocked: true,
            accepted_terms_date: true,
            hashed_password: true,
            startup_id: true,
            investor_id: true,
            expert_id: true,
          },
        },
      },
    });

    const user = {
      ...userOrganization?.user,
      organization_id: organization?.id,
    };

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: number, organization_id: number) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return {
      ...user,
      organization_id,
    };
  } catch {
    return null;
  }
};

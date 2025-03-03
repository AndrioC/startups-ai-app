import prisma from "@/prisma/client";

export async function getUserByEmailAndSlug(email: string, slug: string) {
  const organization = await prisma.organizations.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!organization) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      email_organization_id: {
        email,
        organization_id: organization.id,
      },
    },
  });
}

export async function getOrganizationIdBySlug(slug: string) {
  const organization = await prisma.organizations.findUnique({
    where: { slug },
    select: { id: true },
  });

  return organization ? organization.id : null;
}

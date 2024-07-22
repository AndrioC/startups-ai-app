import prisma from "../prisma/client";

export async function getSubdomainsFromDatabase(): Promise<string[]> {
  const subdomains = await prisma.organizations.findMany();
  return subdomains.map((s) => s.slug);
}

import { organizations } from "@prisma/client";

import prisma from "../prisma/client";

type EmailVerificationResult = {
  exists: boolean;
  organization: organizations | null;
};

export async function checkIfEmailIsNotVerified(
  email: string,
  slug: string
): Promise<EmailVerificationResult> {
  const organization = await prisma.organizations.findFirst({
    where: { slug },
  });

  if (!organization) {
    return { exists: false, organization: null };
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
      organization_id: organization.id,
      email_verified: {
        not: null,
      },
    },
  });

  if (!user) {
    return { exists: false, organization: organization };
  }

  return {
    exists: true,
    organization,
  };
}

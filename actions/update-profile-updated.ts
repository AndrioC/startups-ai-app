import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateProfileUpdated(startupId: number) {
  const startup = await prisma.startups.findUnique({
    where: { id: startupId },
  });

  if (!startup) {
    throw new Error("Startup not found");
  }

  if (
    startup.profile_filled_percentage !== 100 ||
    startup.fully_completed_profile !== true
  ) {
    return;
  }

  await prisma.startups.update({
    where: { id: startupId },
    data: {
      profile_updated: true,
    },
  });
}

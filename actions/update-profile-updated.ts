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
    startup.profile_filled_percentage === null ||
    startup.profile_filled_percentage !== 100 ||
    startup.fully_completed_profile === true
  ) {
    return;
  }

  if (startup.fully_completed_profile) {
    await prisma.startups.update({
      where: { id: startupId },
      data: {
        profile_updated: true,
      },
    });
  }
}

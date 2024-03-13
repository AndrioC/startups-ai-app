import { StartupTableComponent } from "@/components/pages/startups/list/startup-table";
import prisma from "@/prisma/client";

export default async function StartupsPage() {
  const startupsCount = await prisma.startups.count();

  return <StartupTableComponent startupsCount={startupsCount} />;
}

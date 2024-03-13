import { ExpertTableComponent } from "@/components/pages/experts/list/expert-table";
import prisma from "@/prisma/client";

export default async function ExpertsPage() {
  const expertsCount = await prisma.experts.count();
  return <ExpertTableComponent expertsCount={expertsCount} />;
}

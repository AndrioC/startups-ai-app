import BarChart from "@/components/charts/barchart";
import DashCards from "@/components/dashcardslist";
import prisma from "@/prisma/client";

export default async function WebApp() {
  const startupsCount = await prisma.startups.count({
    where: { is_approved: true },
  });
  const investors = await prisma.investors.count({
    where: { is_approved: true },
  });
  const expertsCount = await prisma.experts.count({
    where: { is_approved: true },
  });
  const companiesCount = await prisma.organizations.count({
    where: {
      NOT: {
        id: 3,
      },
    },
  });

  const dashCount = {
    startupsCount,
    investorsCount: investors,
    expertsCount,
    companiesCount,
  };

  return (
    <>
      <DashCards dashCount={dashCount} />
      <div className="px-32 p-10 grid md:grid-cols-3 grid-cols-1 gap-4">
        <BarChart />
      </div>
    </>
  );
}

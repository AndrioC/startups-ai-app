import { EnterpriseCategoryType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface MonthlyDataItem {
  name: string;
  startups: number;
  mentors: number;
  investors: number;
  government: number;
  traditionalCompanies: number;
  innovationEnvironments: number;
  countries: Set<number>;
}

const ptBRMonths = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export async function GET(
  request: NextRequest,
  { params }: { params: { organization_id: string } }
) {
  if (!params.organization_id) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }
  try {
    const orgId = Number(params.organization_id);

    const startups = await prisma.startups.findMany({
      where: {
        startup_organizations: {
          some: {
            organization_id: orgId,
          },
        },
        is_deleted: false,
      },
      select: { id: true, created_at: true, country_id: true },
    });

    const mentors = await prisma.experts.findMany({
      where: {
        expert_organizations: {
          some: {
            organization_id: orgId,
          },
        },
        is_deleted: false,
      },
      select: { id: true, created_at: true, country_id: true },
    });

    const investors = await prisma.investors.findMany({
      where: {
        investor_organizations: {
          some: {
            organization_id: orgId,
          },
        },
        is_deleted: false,
      },
      select: { id: true, created_at: true, country_id: true },
    });

    const enterprises = await prisma.enterprise.findMany({
      where: {
        enterprise_organizations: {
          some: {
            organization_id: orgId,
          },
        },
        is_deleted: false,
      },
      include: {
        enterprise_category: true,
      },
    });

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthlyData: MonthlyDataItem[] = Array(12)
      .fill(0)
      .map((_, index) => ({
        name: `${ptBRMonths[index]}/${currentYear.toString().slice(2)}`,
        startups: 0,
        mentors: 0,
        investors: 0,
        government: 0,
        traditionalCompanies: 0,
        innovationEnvironments: 0,
        countries: new Set<number>(),
      }));

    let totalStartups = 0;
    let totalMentors = 0;
    let totalInvestors = 0;
    let totalGovernment = 0;
    let totalTraditionalCompanies = 0;
    let totalInnovationEnvironments = 0;
    const totalCountries = new Set<number>();

    let lastMonthStartups = 0;
    let lastMonthMentors = 0;
    let lastMonthInvestors = 0;
    let lastMonthGovernment = 0;
    let lastMonthTraditionalCompanies = 0;
    let lastMonthInnovationEnvironments = 0;
    let currentMonthStartups = 0;
    let currentMonthMentors = 0;
    let currentMonthInvestors = 0;
    let currentMonthGovernment = 0;
    let currentMonthTraditionalCompanies = 0;
    let currentMonthInnovationEnvironments = 0;

    startups.forEach((startup) => {
      const createdAt = new Date(startup.created_at);
      const month = createdAt.getMonth();
      const year = createdAt.getFullYear();

      if (
        year === currentYear ||
        (year === lastMonthYear && month === lastMonth)
      ) {
        if (year === currentYear) {
          monthlyData[month].startups++;
          if (startup.country_id !== null) {
            monthlyData[month].countries.add(startup.country_id);
            totalCountries.add(startup.country_id);
          }
        }

        if (month === currentMonth && year === currentYear) {
          currentMonthStartups++;
        } else if (
          month === lastMonth &&
          (year === currentYear || year === lastMonthYear)
        ) {
          lastMonthStartups++;
        }
      }
      totalStartups++;
    });

    mentors.forEach((mentor) => {
      const createdAt = new Date(mentor.created_at);
      const month = createdAt.getMonth();
      const year = createdAt.getFullYear();

      if (
        year === currentYear ||
        (year === lastMonthYear && month === lastMonth)
      ) {
        if (year === currentYear) {
          monthlyData[month].mentors++;
          if (mentor.country_id !== null) {
            monthlyData[month].countries.add(mentor.country_id);
            totalCountries.add(mentor.country_id);
          }
        }

        if (month === currentMonth && year === currentYear) {
          currentMonthMentors++;
        } else if (
          month === lastMonth &&
          (year === currentYear || year === lastMonthYear)
        ) {
          lastMonthMentors++;
        }
      }
      totalMentors++;
    });

    investors.forEach((investor) => {
      const createdAt = new Date(investor.created_at);
      const month = createdAt.getMonth();
      const year = createdAt.getFullYear();

      if (
        year === currentYear ||
        (year === lastMonthYear && month === lastMonth)
      ) {
        if (year === currentYear) {
          monthlyData[month].investors++;
          if (investor.country_id !== null) {
            monthlyData[month].countries.add(investor.country_id);
            totalCountries.add(investor.country_id);
          }
        }

        if (month === currentMonth && year === currentYear) {
          currentMonthInvestors++;
        } else if (
          month === lastMonth &&
          (year === currentYear || year === lastMonthYear)
        ) {
          lastMonthInvestors++;
        }
      }
      totalInvestors++;
    });

    enterprises.forEach((enterprise) => {
      const createdAt = new Date(enterprise.created_at);
      const month = createdAt.getMonth();
      const year = createdAt.getFullYear();
      const categoryCode = enterprise.enterprise_category?.code;

      if (
        year === currentYear ||
        (year === lastMonthYear && month === lastMonth)
      ) {
        if (year === currentYear) {
          if (categoryCode === EnterpriseCategoryType.GOVERNMENT) {
            monthlyData[month].government++;
          } else if (
            categoryCode === EnterpriseCategoryType.TRADITIONAL_COMPANY
          ) {
            monthlyData[month].traditionalCompanies++;
          } else if (
            categoryCode === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
          ) {
            monthlyData[month].innovationEnvironments++;
          }

          if (enterprise.country_id !== null) {
            monthlyData[month].countries.add(enterprise.country_id);
            totalCountries.add(enterprise.country_id);
          }
        }

        if (month === currentMonth && year === currentYear) {
          if (categoryCode === EnterpriseCategoryType.GOVERNMENT) {
            currentMonthGovernment++;
          } else if (
            categoryCode === EnterpriseCategoryType.TRADITIONAL_COMPANY
          ) {
            currentMonthTraditionalCompanies++;
          } else if (
            categoryCode === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
          ) {
            currentMonthInnovationEnvironments++;
          }
        } else if (
          month === lastMonth &&
          (year === currentYear || year === lastMonthYear)
        ) {
          if (categoryCode === EnterpriseCategoryType.GOVERNMENT) {
            lastMonthGovernment++;
          } else if (
            categoryCode === EnterpriseCategoryType.TRADITIONAL_COMPANY
          ) {
            lastMonthTraditionalCompanies++;
          } else if (
            categoryCode === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
          ) {
            lastMonthInnovationEnvironments++;
          }
        }
      }

      if (categoryCode === EnterpriseCategoryType.GOVERNMENT) {
        totalGovernment++;
      } else if (categoryCode === EnterpriseCategoryType.TRADITIONAL_COMPANY) {
        totalTraditionalCompanies++;
      } else if (
        categoryCode === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
      ) {
        totalInnovationEnvironments++;
      }
    });

    const calculatePercentageChange = (current: number, previous: number) => {
      return previous === 0
        ? current > 0
          ? 100
          : 0
        : ((current - previous) / previous) * 100;
    };

    const startupsPercentageChange = calculatePercentageChange(
      currentMonthStartups,
      lastMonthStartups
    );
    const mentorsPercentageChange = calculatePercentageChange(
      currentMonthMentors,
      lastMonthMentors
    );
    const investorsPercentageChange = calculatePercentageChange(
      currentMonthInvestors,
      lastMonthInvestors
    );
    const governmentPercentageChange = calculatePercentageChange(
      currentMonthGovernment,
      lastMonthGovernment
    );
    const traditionalCompaniesPercentageChange = calculatePercentageChange(
      currentMonthTraditionalCompanies,
      lastMonthTraditionalCompanies
    );
    const innovationEnvironmentsPercentageChange = calculatePercentageChange(
      currentMonthInnovationEnvironments,
      lastMonthInnovationEnvironments
    );

    const currentMonthCountries = new Set(monthlyData[currentMonth].countries);
    const lastMonthCountries = new Set(monthlyData[lastMonth].countries);
    const countriesPercentageChange = calculatePercentageChange(
      currentMonthCountries.size,
      lastMonthCountries.size
    );

    const finalMonthlyData = monthlyData.map((data) => ({
      ...data,
      countries: data.countries.size,
    }));

    return NextResponse.json({
      monthlyData: finalMonthlyData,
      totalStartups,
      totalMentors,
      totalInvestors,
      totalGovernment,
      totalTraditionalCompanies,
      totalInnovationEnvironments,
      totalCountries: totalCountries.size,

      startupsPercentageChange: Number(startupsPercentageChange.toFixed(2)),
      mentorsPercentageChange: Number(mentorsPercentageChange.toFixed(2)),
      investorsPercentageChange: Number(investorsPercentageChange.toFixed(2)),
      governmentPercentageChange: Number(governmentPercentageChange.toFixed(2)),
      traditionalCompaniesPercentageChange: Number(
        traditionalCompaniesPercentageChange.toFixed(2)
      ),
      innovationEnvironmentsPercentageChange: Number(
        innovationEnvironmentsPercentageChange.toFixed(2)
      ),
      countriesPercentageChange: Number(countriesPercentageChange.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

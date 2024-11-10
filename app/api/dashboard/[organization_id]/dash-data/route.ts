import { NextRequest, NextResponse } from "next/server";

import prisma from "@/prisma/client";

interface MonthlyDataItem {
  name: string;
  startups: number;
  mentors: number;
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
    const orgId = parseInt(params.organization_id);

    const startups = await prisma.startups.findMany({
      where: {
        organization_id: orgId,
        is_deleted: false,
      },
      select: { created_at: true, country_id: true },
    });

    const mentors = await prisma.experts.findMany({
      where: {
        organization_id: orgId,
        is_deleted: false,
        is_approved: true,
      },
      select: { created_at: true, country_id: true },
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
        countries: new Set<number>(),
      }));

    let totalStartups = 0;
    let totalMentors = 0;
    const totalCountries = new Set<number>();
    let lastMonthStartups = 0;
    let lastMonthMentors = 0;
    let currentMonthStartups = 0;
    let currentMonthMentors = 0;

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

    const startupsPercentageChange =
      lastMonthStartups === 0
        ? currentMonthStartups > 0
          ? 100
          : 0
        : ((currentMonthStartups - lastMonthStartups) / lastMonthStartups) *
          100;

    const mentorsPercentageChange =
      lastMonthMentors === 0
        ? currentMonthMentors > 0
          ? 100
          : 0
        : ((currentMonthMentors - lastMonthMentors) / lastMonthMentors) * 100;

    const currentMonthCountries = new Set(monthlyData[currentMonth].countries);
    const lastMonthCountries = new Set(monthlyData[lastMonth].countries);
    const countriesPercentageChange =
      lastMonthCountries.size === 0
        ? currentMonthCountries.size > 0
          ? 100
          : 0
        : ((currentMonthCountries.size - lastMonthCountries.size) /
            lastMonthCountries.size) *
          100;

    const finalMonthlyData = monthlyData.map((data) => ({
      ...data,
      countries: data.countries.size,
    }));

    return NextResponse.json({
      monthlyData: finalMonthlyData,
      totalStartups,
      totalMentors,
      totalCountries: totalCountries.size,
      startupsPercentageChange: parseFloat(startupsPercentageChange.toFixed(2)),
      mentorsPercentageChange: parseFloat(mentorsPercentageChange.toFixed(2)),
      countriesPercentageChange: parseFloat(
        countriesPercentageChange.toFixed(2)
      ),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

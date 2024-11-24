"use client";

import React, { useMemo, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { IoRocketOutline, IoWalletOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRightLeftIcon, ChevronDown, GlobeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import LoadingSpinner from "@/components/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Chart from "./chart";

interface DashboardData {
  monthlyData: {
    name: string;
    startups: number;
    mentors: number;
    countries: number;
  }[];
  totalStartups: number;
  totalMentors: number;
  totalCountries: number;
  startupsPercentageChange: number;
  mentorsPercentageChange: number;
  countriesPercentageChange: number;
}

type MetricKey = "startups" | "mentors";

const translateMonthNames = (
  monthData: DashboardData["monthlyData"],
  locale: string
) => {
  const englishMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const portugueseMonths = [
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

  return monthData.map((item) => {
    const [month, year] = item.name.split("/");
    const monthIndex = portugueseMonths.indexOf(month);
    const translatedMonth =
      locale === "en"
        ? englishMonths[monthIndex]
        : portugueseMonths[monthIndex];
    return {
      ...item,
      name: `${translatedMonth}/${year}`,
    };
  });
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
}) => {
  const t = useTranslations("admin.dashboard");
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-2 rounded-full ${
              title === t("metrics.startups")
                ? "bg-blue-100"
                : title === t("metrics.investors")
                  ? "bg-green-100"
                  : title === t("metrics.mentors")
                    ? "bg-yellow-100"
                    : title === t("metrics.countries")
                      ? "bg-purple-100"
                      : "bg-orange-100"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                title === t("metrics.startups")
                  ? "text-blue-500"
                  : title === t("metrics.investors")
                    ? "text-green-500"
                    : title === t("metrics.mentors")
                      ? "text-yellow-500"
                      : title === t("metrics.countries")
                        ? "text-purple-500"
                        : "text-orange-500"
              }`}
            />
          </div>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold">{value}</p>
        <p
          className={`text-sm ${
            changeType === "positive" ? "text-green-500" : "text-red-500"
          }`}
        >
          {changeType === "positive" ? "+" : ""}
          {change}
        </p>
      </CardContent>
    </Card>
  );
};

const MatchCard = ({
  icon1: Icon1,
  icon2: Icon2,
  value,
}: {
  icon1: React.ElementType;
  icon2: React.ElementType;
  value: string;
}) => {
  const t = useTranslations("admin.dashboard");
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-2">
              <Icon1 className="w-6 h-6 text-blue-500" />
            </div>
            <ArrowRightLeftIcon className="w-4 h-4 text-gray-400 mx-1" />
            <div
              className={`p-2 rounded-full ${
                Icon2 === IoWalletOutline
                  ? "bg-green-100"
                  : Icon2 === BsPeople
                    ? "bg-yellow-100"
                    : "bg-blue-100"
              }`}
            >
              <Icon2
                className={`w-6 h-6 ${
                  Icon2 === IoWalletOutline
                    ? "text-green-500"
                    : Icon2 === BsPeople
                      ? "text-yellow-500"
                      : "text-blue-500"
                }`}
              />
            </div>
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {Icon2 === IoWalletOutline
            ? t("matchmaking.startupsInvestors")
            : Icon2 === BsPeople
              ? t("matchmaking.startupsMentors")
              : t("matchmaking.startupsStartups")}
        </p>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("startups");
  const t = useTranslations("admin.dashboard");
  const locale = useLocale();

  const { data: dashboardData, isLoading } = useDashboardData(
    Number(session?.user?.organization_id)
  );

  const translatedMonthlyData = useMemo(() => {
    if (dashboardData) {
      return translateMonthNames(dashboardData.monthlyData, locale);
    }
    return [];
  }, [dashboardData, locale]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  if (!dashboardData) {
    return <div>{t("error")}</div>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={IoRocketOutline}
          title={t("metrics.startups")}
          value={dashboardData.totalStartups.toString()}
          change={`${dashboardData.startupsPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.startupsPercentageChange >= 0
              ? "positive"
              : "negative"
          }
        />
        <StatCard
          icon={IoWalletOutline}
          title={t("metrics.investors")}
          value="12"
          change="7%"
          changeType="negative"
        />
        <StatCard
          icon={BsPeople}
          title={t("metrics.mentors")}
          value={dashboardData.totalMentors.toString()}
          change={`${dashboardData.mentorsPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.mentorsPercentageChange >= 0 ? "positive" : "negative"
          }
        />
        <StatCard
          icon={GlobeIcon}
          title={t("metrics.countries")}
          value={dashboardData.totalCountries.toString()}
          change={`${dashboardData.countriesPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.countriesPercentageChange >= 0
              ? "positive"
              : "negative"
          }
        />
        <StatCard
          icon={ArrowRightLeftIcon}
          title={t("metrics.matches")}
          value="253"
          change="24%"
          changeType="positive"
        />
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{t("statistics")}</h2>
            <div className="relative">
              <Select
                defaultValue="startups"
                onValueChange={(value) => setSelectedMetric(value as MetricKey)}
              >
                <SelectTrigger className="w-[130px] border-none focus:ring-0 focus:ring-offset-0 text-base font-normal text-gray-800 pl-0 pr-8 [&>svg]:hidden">
                  <SelectValue placeholder={t("select.metric")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startups">
                    {t("metrics.startups")}
                  </SelectItem>
                  <SelectItem value="mentors">
                    {t("metrics.mentors")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <ChevronDown className="h-5 w-5 text-blue-500 fill-current absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <Chart data={translatedMonthlyData} selectedMetric={selectedMetric} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MatchCard
          icon1={IoRocketOutline}
          icon2={IoWalletOutline}
          value="156"
        />
        <MatchCard icon1={IoRocketOutline} icon2={BsPeople} value="85" />
        <MatchCard
          icon1={IoRocketOutline}
          icon2={IoRocketOutline}
          value="354"
        />
      </div>
    </div>
  );
}

const useDashboardData = (organization_id: number) => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data", organization_id],
    queryFn: () =>
      axios
        .get(`/api/dashboard/${organization_id}/dash-data`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!organization_id,
  });
};

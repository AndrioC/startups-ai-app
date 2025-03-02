"use client";

import React, { useMemo, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { IoRocketOutline, IoWalletOutline } from "react-icons/io5";
import {
  MdOutlineBusiness,
  MdOutlineBusinessCenter,
  MdOutlineSchool,
} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRightLeftIcon, GlobeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

import LoadingSpinner from "@/components/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";

import Chart from "./chart";
import MetricSelect from "./metric-select";

interface DashboardData {
  monthlyData: {
    name: string;
    startups: number;
    mentors: number;
    investors: number;
    government: number;
    traditionalCompanies: number;
    innovationEnvironments: number;
    countries: number;
  }[];
  totalStartups: number;
  totalMentors: number;
  totalInvestors: number;
  totalGovernment: number;
  totalTraditionalCompanies: number;
  totalInnovationEnvironments: number;
  totalCountries: number;
  startupsPercentageChange: number;
  mentorsPercentageChange: number;
  investorsPercentageChange: number;
  governmentPercentageChange: number;
  traditionalCompaniesPercentageChange: number;
  innovationEnvironmentsPercentageChange: number;
  countriesPercentageChange: number;
}

const METRIC_COLORS = {
  startups: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "bg-blue-100",
    gradient: "from-blue-100 to-blue-200",
  },
  investors: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "bg-green-100",
    gradient: "from-green-100 to-green-200",
  },
  mentors: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    icon: "bg-yellow-100",
    gradient: "from-yellow-100 to-yellow-200",
  },
  countries: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "bg-purple-100",
    gradient: "from-purple-100 to-purple-200",
  },
  government: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "bg-red-100",
    gradient: "from-red-100 to-red-200",
  },
  traditionalCompanies: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    icon: "bg-indigo-100",
    gradient: "from-indigo-100 to-indigo-200",
  },
  innovationEnvironments: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    icon: "bg-cyan-100",
    gradient: "from-cyan-100 to-cyan-200",
  },
  default: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    icon: "bg-orange-100",
    gradient: "from-orange-100 to-orange-200",
  },
};

type MetricKey =
  | "startups"
  | "mentors"
  | "investors"
  | "government"
  | "traditionalCompanies"
  | "innovationEnvironments";

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

  const metricKey =
    Object.keys(METRIC_COLORS).find((key) => title === t(`metrics.${key}`)) ||
    "default";

  const {
    bg: bgColor,
    text: textColor,
    icon: iconBgColor,
    gradient,
  } = METRIC_COLORS[metricKey as MetricKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card
        className={`
          flex-1 min-w-[250px] 
          border-none 
          shadow-lg 
          rounded-xl 
          overflow-hidden 
          transition-all 
          duration-300 
          hover:shadow-xl
          ${bgColor}
        `}
      >
        <CardContent className="p-6 relative">
          <div
            className={`
              absolute 
              inset-0 
              bg-gradient-to-br 
              ${gradient} 
              opacity-10 
              z-0
            `}
          />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <div
              className={`
                p-3 
                rounded-xl 
                shadow-md 
                ${iconBgColor}
                transform 
                transition-transform 
                duration-300 
                group-hover:scale-105
              `}
            >
              <Icon
                className={`
                  w-7 h-7 
                  ${textColor}
                `}
              />
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <h3
              className={`
                text-sm 
                font-medium 
                ${textColor} 
                opacity-70
              `}
            >
              {title}
            </h3>
            <p
              className={`
                text-3xl 
                font-bold 
                ${textColor}
              `}
            >
              {value}
            </p>
            <p
              className={`
                text-sm 
                font-semibold 
                ${changeType === "positive" ? "text-green-600" : "text-red-600"}
              `}
            >
              {changeType === "positive" ? "+" : ""}
              {change}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
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
          value={dashboardData.totalInvestors.toString()}
          change={`${dashboardData.investorsPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.investorsPercentageChange >= 0
              ? "positive"
              : "negative"
          }
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
          icon={MdOutlineBusiness}
          title={t("metrics.government")}
          value={dashboardData.totalGovernment.toString()}
          change={`${dashboardData.governmentPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.governmentPercentageChange >= 0
              ? "positive"
              : "negative"
          }
        />
        <StatCard
          icon={MdOutlineBusinessCenter}
          title={t("metrics.traditionalCompanies")}
          value={dashboardData.totalTraditionalCompanies.toString()}
          change={`${dashboardData.traditionalCompaniesPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.traditionalCompaniesPercentageChange >= 0
              ? "positive"
              : "negative"
          }
        />
        <StatCard
          icon={MdOutlineSchool}
          title={t("metrics.innovationEnvironments")}
          value={dashboardData.totalInnovationEnvironments.toString()}
          change={`${dashboardData.innovationEnvironmentsPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.innovationEnvironmentsPercentageChange >= 0
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
            <MetricSelect
              selectedMetric={selectedMetric}
              setSelectedMetric={setSelectedMetric}
              t={t}
            />
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

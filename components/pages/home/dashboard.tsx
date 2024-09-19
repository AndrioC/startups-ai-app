"use client";

import React, { useState } from "react";
import { BsPeople } from "react-icons/bs";
import { IoRocketOutline, IoWalletOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowRightLeftIcon, ChevronDown, GlobeIcon } from "lucide-react";
import { useSession } from "next-auth/react";

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
}) => (
  <Card className="flex-1 min-w-[200px]">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-2 rounded-full ${title === "Startups" ? "bg-blue-100" : title === "Investidores" ? "bg-green-100" : title === "Mentores" ? "bg-yellow-100" : title === "Países" ? "bg-purple-100" : "bg-orange-100"}`}
        >
          <Icon
            className={`w-6 h-6 ${title === "Startups" ? "text-blue-500" : title === "Investidores" ? "text-green-500" : title === "Mentores" ? "text-yellow-500" : title === "Países" ? "text-purple-500" : "text-orange-500"}`}
          />
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold">{value}</p>
      <p
        className={`text-sm ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}
      >
        {changeType === "positive" ? "+" : ""}
        {change}
      </p>
    </CardContent>
  </Card>
);

const MatchCard = ({
  icon1: Icon1,
  icon2: Icon2,
  value,
}: {
  icon1: React.ElementType;
  icon2: React.ElementType;
  value: string;
}) => (
  <Card className="flex-1 min-w-[200px]">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 mr-2">
            <Icon1 className="w-6 h-6 text-blue-500" />
          </div>
          <ArrowRightLeftIcon className="w-4 h-4 text-gray-400 mx-1" />
          <div
            className={`p-2 rounded-full ${Icon2 === IoWalletOutline ? "bg-green-100" : Icon2 === BsPeople ? "bg-yellow-100" : "bg-blue-100"}`}
          >
            <Icon2
              className={`w-6 h-6 ${Icon2 === IoWalletOutline ? "text-green-500" : Icon2 === BsPeople ? "text-yellow-500" : "text-blue-500"}`}
            />
          </div>
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">
        {Icon2 === IoWalletOutline
          ? "Matchmaking entre Startups e Investidores"
          : Icon2 === BsPeople
            ? "Matchmaking entre Startups e Mentores"
            : "Matchmaking entre Startups"}
      </p>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("startups");

  console.log("session: ", session);

  const { data: dashboardData, isLoading } = useDashboardData(
    Number(session?.user?.organization_id)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  if (!dashboardData) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={IoRocketOutline}
          title="Startups"
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
          title="Investidores"
          value="12"
          change="7%"
          changeType="negative"
        />
        <StatCard
          icon={BsPeople}
          title="Mentores"
          value={dashboardData.totalMentors.toString()}
          change={`${dashboardData.mentorsPercentageChange.toFixed(2)}%`}
          changeType={
            dashboardData.mentorsPercentageChange >= 0 ? "positive" : "negative"
          }
        />
        <StatCard
          icon={GlobeIcon}
          title="Países"
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
          title="Matches"
          value="253"
          change="24%"
          changeType="positive"
        />
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Estatísticas</h2>
            <div className="relative">
              <Select
                defaultValue="startups"
                onValueChange={(value) => setSelectedMetric(value as MetricKey)}
              >
                <SelectTrigger className="w-[130px] border-none focus:ring-0 focus:ring-offset-0 text-base font-normal text-gray-800 pl-0 pr-8 [&>svg]:hidden">
                  <SelectValue placeholder="Selecione a métrica" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startups">Startups</SelectItem>
                  <SelectItem value="mentors">Mentores</SelectItem>
                </SelectContent>
              </Select>
              <ChevronDown className="h-5 w-5 text-blue-500 fill-current absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <Chart
            data={dashboardData.monthlyData}
            selectedMetric={selectedMetric}
          />
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

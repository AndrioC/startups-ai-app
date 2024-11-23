"use client";
import React, { useEffect, useState } from "react";
import {
  business_model,
  challenges,
  country,
  maturity_level,
  objectives,
  operational_stage,
  position,
  service_products,
  vertical,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import LoadingSpinner from "@/components/loading-spinner";

import DeepTechDataForm from "./forms/deep-tech-data-form";
import GeneralDataForm from "./forms/general-data-form/general-data-form";
import GovernanceDataForm from "./forms/governance-data-form";
import MarketFinanceDataForm from "./forms/market-finance-data-form/market-finance-data-form";
import ProductServiceDataForm from "./forms/product-service-data-form";
import ProfileDataForm from "./forms/profile-data-form/profile-data-form";
import TeamDataForm from "./forms/team-data-form/team-data-form";

export interface SelectDataProps {
  country: country[];
  vertical: vertical[];
  operational_stage: operational_stage[];
  business_model: business_model[];
  challenges: challenges[];
  objectives: objectives[];
  position: position[];
  service_products: service_products[];
  maturity_level: maturity_level[];
}

export default function StartupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("startupForm");
  const tabQuery = searchParams.get("subTab");

  const tabs = [
    { id: "general-data", title: t("sub-tabs.generalData") },
    { id: "team", title: t("sub-tabs.team") },
    { id: "product-service", title: t("sub-tabs.productService") },
    { id: "deeptech", title: t("sub-tabs.deepTech") },
    { id: "governance", title: t("sub-tabs.governance") },
    { id: "market-finance", title: t("sub-tabs.marketFinance") },
    { id: "matchmaking", title: t("sub-tabs.matchmaking"), disabled: true },
    { id: "profile", title: t("sub-tabs.profile"), icon: Sparkles },
  ];

  const defaultTab = "general-data";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery && !tab.disabled);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("subTab", defaultTab);
      router.push(`?${params.toString()}`);
    }
  }, [isValidTab, router, searchParams]);

  const { data, isLoading } = useSelectData();

  if (isLoading) return <LoadingSpinner />;

  const tabContents = [
    <GeneralDataForm key={"general-data"} data={data!} />,
    <TeamDataForm key={"team"} data={data!} />,
    <ProductServiceDataForm key={"product-service"} data={data!} />,
    <DeepTechDataForm key={"deeptech"} data={data!} />,
    <GovernanceDataForm key={"governance"} />,
    <MarketFinanceDataForm key={"market-finance"} />,
    <ProfileDataForm key={"profile"} />,
  ];

  const handleTabChange = (id: string) => {
    const selectedTab = tabs.find((tab) => tab.id === id);
    if (selectedTab && !selectedTab.disabled) {
      setActiveTab(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("subTab", id);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="w-full h-[2100px] bg-[#F1F3F3] rounded-lg shadow-lg p-6 mb-10 relative">
      <div className="flex justify-between mb-1">
        {tabs.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-sm flex items-center gap-1 whitespace-nowrap ${
                tab.disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : activeTab === tab.id
                    ? "text-gray-800"
                    : "text-gray-500"
              }`}
              disabled={tab.disabled}
              style={{ minWidth: "100px" }}
            >
              {tab.icon && (
                <tab.icon
                  className="w-4 h-4"
                  style={
                    tab.id === "profile"
                      ? { color: "#2292EA", fill: "#2292EA" }
                      : {}
                  }
                />
              )}
              {tab.title}
            </button>
            {activeTab === tab.id && !tab.disabled && (
              <motion.div
                layoutId="underline-startup-form"
                className="absolute bottom-[-6px] left-0 w-full h-1 bg-gray-400"
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-gray-300 mb-4"></div>
      <div className="flex-grow">
        {tabContents.filter((tab) => tab.key === activeTab)}
      </div>
    </div>
  );
}

const useSelectData = () =>
  useQuery<SelectDataProps>({
    queryKey: ["select-data"],
    queryFn: () =>
      axios.get("/api/selects-data").then((res) => {
        return res.data;
      }),
    staleTime: 5 * 60 * 1000,
  });

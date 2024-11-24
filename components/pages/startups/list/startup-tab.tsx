"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import DeepTechDataTab from "./tabs/deep-tech-data-tab";
import GeneralDataTab from "./tabs/general-data-tab";
import GovernanceDataTab from "./tabs/governance-data-tab";
import MarketFinanceDataTab from "./tabs/market-finance-data-tab/market-finance-data-tab";
import ProductServiceDataTab from "./tabs/product-service-data-tab";
import ProfileDataTab from "./tabs/profile-data-tab/profile-data-tab";
import TeamDataTab from "./tabs/team-data-tab/team-data-tab";

export default function StartupTab() {
  const t = useTranslations("admin.startups.startupTab");
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabQuery = searchParams.get("startup-tab");

  const tabs = [
    { id: "general-data-tab", title: t("tabs.generalData") },
    { id: "team-tab", title: t("tabs.team") },
    { id: "product-service-tab", title: t("tabs.productService") },
    { id: "deeptech-tab", title: t("tabs.deepTech") },
    { id: "governance-tab", title: t("tabs.governance") },
    { id: "market-finance-tab", title: t("tabs.marketFinance") },
    { id: "matches-tab", title: t("tabs.matches"), disabled: true },
    { id: "historical-tab", title: t("tabs.historical"), disabled: true },
    { id: "profile-tab", title: t("tabs.profile"), icon: Sparkles },
  ];

  const defaultTab = "general-data-tab";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("startup-tab", defaultTab);
      router.push(`?${params.toString()}`);
    }
  }, [isValidTab, router, searchParams]);

  const tabContents = [
    <GeneralDataTab key={"general-data-tab"} />,
    <TeamDataTab key={"team-tab"} />,
    <ProductServiceDataTab key={"product-service-tab"} />,
    <DeepTechDataTab key={"deeptech-tab"} />,
    <GovernanceDataTab key={"governance-tab"} />,
    <MarketFinanceDataTab key={"market-finance-tab"} />,
    <ProfileDataTab key="profile-tab" />,
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("startup-tab", id);
    router.push(`?${params.toString()}`);
  };

  const handleBack = () => {
    router.push("/management/startups");
  };

  return (
    <div className="w-full h-[2100px] bg-[#F1F3F3] rounded-lg shadow-lg p-6 mb-10 relative">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handleBack}
          className="p-2 text-gray-500 bg-transparent rounded-full hover:bg-gray-200 transition-colors"
          aria-label={t("back")}
        >
          <ArrowLeft className="mr-2" size={20} />
        </Button>
      </div>
      <div className="flex justify-between mb-1">
        {tabs.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleTabChange(tab.id)}
              className={`px-2 py-2 text-base flex items-center gap-1 ${
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
                    tab.id === "profile-tab"
                      ? { color: "#2292EA", fill: "#2292EA" }
                      : {}
                  }
                />
              )}
              {tab.title}
            </button>
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline"
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

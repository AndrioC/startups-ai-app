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
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { AvailableProgramsTab } from "./startup-programs-tabs/available-programs/available-programs";
import { HistoricalParticipationTab } from "./startup-programs-tabs/historical-participation/historical-participation";
import StartupDocuments from "./startup-documents";

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

export default function StartupPrograms() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabQuery = searchParams.get("subTab");

  const defaultTab = "available-programs";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("subTab", defaultTab);
      router.push(`?${params.toString()}`);
    }
  }, [isValidTab, router, searchParams]);

  const tabContents = [
    <AvailableProgramsTab key={"available-programs"} />,
    <HistoricalParticipationTab key={"participation-history"} />,
    <StartupDocuments key={"startup-documents"} />,
  ];

  const handleTabChange = (id: string) => {
    const selectedTab = tabs.find((tab) => tab.id === id);
    if (selectedTab) {
      setActiveTab(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("subTab", id);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="w-full h-[2100px] bg-[#F1F3F3] rounded-lg shadow-lg p-6 mb-10 relative">
      <div className="flex mb-1">
        {tabs.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-sm flex items-center gap-1 whitespace-nowrap ${
                activeTab === tab.id ? "text-gray-800" : "text-gray-500"
              }`}
              style={{ minWidth: "100px" }}
            >
              {tab.title}
            </button>
            {activeTab === tab.id && (
              <motion.div
                layoutId="underline-programs"
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

const tabs = [
  { id: "available-programs", title: "Programas disponíveis" },
  { id: "participation-history", title: "Histórico de participação" },
  { id: "startup-documents", title: "Documentos" },
];

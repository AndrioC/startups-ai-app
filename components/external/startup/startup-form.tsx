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
import { useRouter, useSearchParams } from "next/navigation";

import DeepTechDataForm from "./forms/deep-tech-data-form";
import GeneralDataForm from "./forms/general-data-form";
import GovernanceDataForm from "./forms/governance-data-form";
import MarketFinanceDataForm from "./forms/market-finance-data-form/market-finance-data-form";
import ProductServiceDataForm from "./forms/product-service-data-form";
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
  // investiment_stages: investiment_stages[];
}

export default function StartupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabQuery = searchParams.get("tab");

  const defaultTab = "general-data";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (!isValidTab) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", defaultTab);
      router.push(`?${params.toString()}`);
    }
  }, [isValidTab, router, searchParams]);

  const { data, isLoading } = useSelectData();

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-10 mb-10">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  const tabContents = [
    <GeneralDataForm key={"general-data"} data={data!} />,
    <TeamDataForm key={"team"} data={data!} />,
    <ProductServiceDataForm key={"product-service"} data={data!} />,
    <DeepTechDataForm key={"deeptech"} data={data!} />,
    <GovernanceDataForm key={"governance"} />,
    <MarketFinanceDataForm key={"market-finance"} />,
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full h-[2100px] bg-[#F1F3F3] rounded-lg shadow-lg p-6 mb-10 relative">
      <div className="flex justify-between mb-1">
        {tabs.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 ${
                activeTab === tab.id ? "text-gray-800" : "text-gray-500"
              }`}
            >
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

const tabs = [
  { id: "general-data", title: "Dados gerais" },
  { id: "team", title: "Equipe" },
  { id: "product-service", title: "Produto e serviço" },
  { id: "deeptech", title: "DeepTech" },
  { id: "governance", title: "Governança" },
  { id: "market-finance", title: "Mercado e Finança" },
];

const useSelectData = () =>
  useQuery<SelectDataProps>({
    queryKey: ["select-data"],
    queryFn: () =>
      axios.get("/api/selects-data").then((res) => {
        return res.data;
      }),
    staleTime: 5 * 60 * 1000,
  });

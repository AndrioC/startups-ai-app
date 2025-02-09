"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";

import GeneralDataForm from "./forms/general-data-form/general-data-form";

interface BaseEntity {
  id: number;
  code: string;
  name_en: string;
  name_pt: string;
}

interface EnterpriseActivityAreaCategory extends BaseEntity {}

interface EnterpriseActivityArea extends BaseEntity {
  enterprise_activity_area_category_id: number;
  enterprise_activity_area_category: EnterpriseActivityAreaCategory;
}

export interface SelectDataProps {
  country: BaseEntity[];
  enterprise_category: BaseEntity[];
  enterprise_objectives: BaseEntity[];
  enterprise_activity_area: EnterpriseActivityArea[];
  enterprise_government_types: BaseEntity[];
  enterprise_college_types: BaseEntity[];
  enterprise_college_courses: BaseEntity[];
  enterprise_college_classification: BaseEntity[];
  enterprise_enterprise_types: BaseEntity[];
  enterprise_college_organization_type: BaseEntity[];
  enterprise_college_activity_area: BaseEntity[];
}

export default function EnterpriseForm() {
  const t = useTranslations();

  const tabs = [{ id: "general-data", title: t("generalData.title") }];

  const { data, isLoading } = useSelectData();

  if (isLoading) return <LoadingSpinner />;

  const tabContents = [<GeneralDataForm key="general-data" data={data!} />];

  return (
    <div className="w-full flex flex-col bg-[#F1F3F3] rounded-lg shadow-lg p-6 relative">
      <div className="flex justify-between mb-1">
        {tabs.map((tab, index) => (
          <div key={index} className="relative">
            <Button
              variant="ghost"
              className="px-4 py-2 text-sm flex items-center gap-1 whitespace-nowrap text-gray-800"
              style={{ minWidth: "100px" }}
            >
              {tab.title}
            </Button>
            <motion.div
              layoutId="underline-enterprise-form"
              className="absolute bottom-[-6px] left-0 w-full h-1 bg-gray-400"
              transition={{ duration: 0.2 }}
            />
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-gray-300 mb-4"></div>
      <div className="flex-grow h-auto">{tabContents}</div>
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

import React from "react";
import { ChevronDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MetricKey =
  | "startups"
  | "mentors"
  | "investors"
  | "government"
  | "traditionalCompanies"
  | "innovationEnvironments";

const MetricSelect = ({
  selectedMetric,
  setSelectedMetric,
  t,
}: {
  selectedMetric: MetricKey;
  setSelectedMetric: (value: MetricKey) => void;
  t: (key: string) => string;
}) => {
  const metricOptions: {
    value: MetricKey;
    label: string;
  }[] = [
    { value: "startups", label: t("metrics.startups") },
    { value: "mentors", label: t("metrics.mentors") },
    { value: "investors", label: t("metrics.investors") },
    {
      value: "government",
      label: t("metrics.government"),
    },
    {
      value: "traditionalCompanies",
      label: t("metrics.traditionalCompanies"),
    },
    {
      value: "innovationEnvironments",
      label: t("metrics.innovationEnvironments"),
    },
  ];

  return (
    <div className="relative">
      <Select
        defaultValue="startups"
        value={selectedMetric}
        onValueChange={(value) => setSelectedMetric(value as MetricKey)}
      >
        <SelectTrigger
          className={`
            w-[250px] 
            border 
            border-gray-300 
            rounded-lg 
            hover:border-gray-400 
            focus:border-blue-500 
            focus:ring-2 
            focus:ring-blue-200 
            transition-all 
            duration-300 
            text-base 
            font-medium 
            text-gray-800 
            pl-4 
            pr-3 
            py-2
          `}
        >
          <div className="flex items-center w-full">
            <SelectValue placeholder={t("select.metric")} />
          </div>
        </SelectTrigger>
        <SelectContent
          className="
            bg-white 
            border 
            border-gray-200 
            rounded-lg 
            shadow-lg 
            overflow-hidden
          "
        >
          {metricOptions.map((option) => {
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                className={`
                  cursor-pointer 
                  hover:bg-gray-100 
                  transition-colors 
                  duration-200 
                  flex 
                  items-center 
                  justify-between
                  px-4 
                  py-2
                  font-medium
                  space-x-4  // This adds horizontal spacing
                `}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <ChevronDown
        className={`
          h-5 
          w-5 
          absolute 
          right-2 
          top-1/2 
          transform 
          -translate-y-1/2 
          pointer-events-none
          text-gray-500
        `}
      />
    </div>
  );
};

export default MetricSelect;

"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormProgramData } from "@/contexts/FormProgramContext";

interface Props {
  setProgramName: React.Dispatch<React.SetStateAction<string>>;
  setProgramStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setProgramEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  programName: string;
  programStartDate: Date | undefined;
  programEndDate: Date | undefined;
}

export default function HeaderProgramsFilter({
  setProgramName,
  setProgramStartDate,
  setProgramEndDate,
  programName,
  programStartDate,
  programEndDate,
}: Props) {
  const t = useTranslations("admin.programs.headerProgramsFilter");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { refetch, isRefetching } = useFormProgramData();

  const [localProgramName, setLocalProgramName] = useState(programName);
  const [localProgramStartDate, setLocalProgramStartDate] = useState<
    Date | undefined
  >(programStartDate);
  const [localProgramEndDate, setLocalProgramEndDate] = useState<
    Date | undefined
  >(programEndDate);

  const handleSearch = () => {
    setProgramName(localProgramName);
    setProgramStartDate(localProgramStartDate);
    setProgramEndDate(localProgramEndDate);
    refetch();
  };

  const clearAllFields = () => {
    setLocalProgramName("");
    setLocalProgramStartDate(undefined);
    setLocalProgramEndDate(undefined);
    setProgramName("");
    setProgramStartDate(undefined);
    setProgramEndDate(undefined);
    refetch();
  };

  const isSearchDisabled =
    !localProgramName && !localProgramStartDate && !localProgramEndDate;

  return (
    <div className="w-full">
      <div
        className="bg-[#E5E7E7] h-[54px] cursor-pointer flex items-center justify-between px-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-[#747D8C] text-[16px] font-bold">
          {t("filter")}
        </span>
        <motion.div
          initial={{ rotate: isCollapsed ? 0 : 180 }}
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isCollapsed ? (
            <FaChevronDown className="text-[#747D8C]" />
          ) : (
            <FaChevronUp className="text-[#747D8C]" />
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden bg-[#F5F7FA]"
          >
            <div className="bg-[#F5F7FA] p-4 flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={localProgramName}
                  onChange={(e) => setLocalProgramName(e.target.value)}
                  placeholder={t("programNamePlaceholder")}
                  className="w-[320px] h-[40px] text-[#A7B6CD] text-[16px] border border-[#A7B6CD] rounded-[6px] placeholder-[#A7B6CD] bg-transparent px-2"
                />
                <div className="relative">
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      setLocalProgramStartDate(newValue);
                    }}
                    value={localProgramStartDate}
                    title={t("programStartDate")}
                    className="bg-transparent border border-[#A7B6CD] rounded-[6px]"
                  />
                </div>
                <div className="relative">
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      setLocalProgramEndDate(newValue);
                    }}
                    value={localProgramEndDate}
                    title={t("programEndDate")}
                    className="bg-transparent border border-[#A7B6CD] rounded-[6px]"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleSearch}
                  disabled={isSearchDisabled || isRefetching}
                  className="w-[40px] h-[40px] bg-[#747D8C] rounded-[6px] flex items-center justify-center"
                  aria-label={t("search")}
                >
                  <FaSearch className="text-white" />
                </Button>
                <Button
                  onClick={clearAllFields}
                  disabled={isSearchDisabled || isRefetching}
                  className="w-[40px] h-[40px] bg-[#747D8C] rounded-[6px] flex items-center justify-center"
                  aria-label={t("clearAll")}
                >
                  <FaTimes className="text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

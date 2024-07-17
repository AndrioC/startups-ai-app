import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import { DatePicker } from "@/components/ui/date-picker";

import { useFormProgramData } from "../../../../contexts/FormProgramContext";
import { Button } from "../../../ui/button";

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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { refetch, isRefetching } = useFormProgramData();

  const clearAllFields = async () => {
    await Promise.all([
      setProgramName(""),
      setProgramStartDate(undefined),
      setProgramEndDate(undefined),
    ]);
    refetch();
  };

  return (
    <div className="w-full">
      <div
        className="bg-[#E5E7E7] h-[54px] cursor-pointer flex items-center justify-between px-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-[#747D8C] text-[16px] font-bold">Filtro</span>
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
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="Nome do programa"
                  className="w-[320px] h-[40px] text-[#A7B6CD] text-[16px] border border-[#A7B6CD] rounded-[6px] placeholder-[#A7B6CD] bg-transparent px-2"
                />
                <div className="relative">
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      setProgramStartDate(newValue);
                    }}
                    value={programStartDate}
                    title="Início do programa"
                    className="bg-transparent border border-[#A7B6CD] rounded-[6px]"
                  />
                  {programStartDate && (
                    <FaTimes
                      className="absolute top-3 right-2 cursor-pointer text-gray-500"
                      onClick={() => setProgramStartDate(undefined)}
                    />
                  )}
                </div>
                <div className="relative">
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      setProgramEndDate(newValue);
                    }}
                    value={programEndDate || undefined}
                    title="Fim do programa"
                    className="bg-transparent border border-[#A7B6CD] rounded-[6px]"
                  />
                  {programEndDate && (
                    <FaTimes
                      className="absolute top-3 right-2 cursor-pointer text-gray-500"
                      onClick={() => setProgramEndDate(undefined)}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => refetch()}
                  disabled={
                    (!programName && !programStartDate && !programEndDate) ||
                    isRefetching
                  }
                  className="w-[40px] h-[40px] bg-[#747D8C] rounded-[6px] flex items-center justify-center"
                >
                  <FaSearch className="text-white" />
                </Button>
                <Button
                  onClick={clearAllFields}
                  disabled={
                    (!programName && !programStartDate && !programEndDate) ||
                    isRefetching
                  }
                  className="w-[40px] h-[40px] bg-[#747D8C] rounded-[6px] flex items-center justify-center"
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

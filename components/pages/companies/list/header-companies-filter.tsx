import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormCompanyData } from "@/contexts/FormCompanyContext";

interface Props {
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  setCompanyCreatedAt: React.Dispatch<React.SetStateAction<Date | undefined>>;
  companyName: string;
  companyCreatedAt: Date | undefined;
}

export default function HeaderCompaniesFilter({
  setCompanyName,
  setCompanyCreatedAt,
  companyName,
  companyCreatedAt,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { refetch, isRefetching } = useFormCompanyData();

  const clearAllFields = async () => {
    await Promise.all([setCompanyName(""), setCompanyCreatedAt(undefined)]);
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
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nome da organização"
                  className="w-[320px] h-[40px] text-[#A7B6CD] text-[16px] border border-[#A7B6CD] rounded-[6px] placeholder-[#A7B6CD] bg-transparent px-2"
                />
                <div className="relative">
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      setCompanyCreatedAt(newValue);
                    }}
                    value={companyCreatedAt}
                    title="Data cadastro"
                    className="bg-transparent border border-[#A7B6CD] rounded-[6px]"
                  />
                  {companyCreatedAt && (
                    <FaTimes
                      className="absolute top-3 right-2 cursor-pointer text-gray-500"
                      onClick={() => setCompanyCreatedAt(undefined)}
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => refetch()}
                  disabled={(!companyName && !companyCreatedAt) || isRefetching}
                  className="w-[40px] h-[40px] bg-[#747D8C] rounded-[6px] flex items-center justify-center"
                >
                  <FaSearch className="text-white" />
                </Button>
                <Button
                  onClick={clearAllFields}
                  disabled={(!companyName && !companyCreatedAt) || isRefetching}
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

import React, { useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdInsertLink } from "react-icons/md";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import ProgramMentorTab from "./tabs/mentors/program-mentor-tab";
import ProgramStartupTab from "./tabs/startups/program-startup-tab";

interface Props {
  title: string;
  start_date: string;
  end_date: string;
}

export default function HeaderProgramPage({
  title,
  start_date,
  end_date,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabQuery = searchParams.get("tab");

  const { token } = useParams();

  const defaultTab = "startups";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/auth/register?token=${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado para a área de transferência!", {
        autoClose: 3000,
        position: "top-center",
      });
    } catch (err) {
      console.error("Falha ao copiar o link", err);
      toast.error("Erro ao copiar o link!", {
        autoClose: 3000,
        position: "top-center",
      });
    }
  };

  const tabContents = [
    <ProgramStartupTab key={"startups"} />,
    <ProgramMentorTab key={"mentors"} />,
  ];

  return (
    <div className="bg-[#FCFCFC] rounded-lg shadow-lg relative w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <MdOutlineModeEditOutline className="h-6 w-6 text-black mr-2" />
          <h1 className="text-xl sm:text-2xl font-semibold text-black">
            {title}
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:ml-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <h1 className="text-sm sm:text-base font-semibold text-black">
            Início: {start_date}
          </h1>
          <h1 className="text-sm sm:text-base font-semibold text-black">
            Fim: {end_date}
          </h1>
        </div>
      </div>
      <div>
        <div className="flex whitespace-nowrap">
          {tabs.map((tab, index) => (
            <div key={index} className="relative flex-shrink-0">
              <button
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm sm:text-base ${
                  activeTab === tab.id ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {tab.title}
              </button>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-[-2px] left-0 w-full h-1 bg-gray-400"
                  style={{ transform: "translateY(100%)" }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-5 w-full">
        <Button
          onClick={handleCopyLink}
          className="flex items-center justify-center border-[#2292EA] bg-transparent border-2 text-[#2292EA] font-medium uppercase text-xs sm:text-sm rounded-[30px] w-full sm:w-auto px-4 py-2 hover:bg-transparent hover:text-[#1f7dc5] transition-colors duration-300 ease-in-out mb-4"
        >
          <MdInsertLink className="h-5 w-5 mr-1 text-[#2292EA]" />
          Copiar link para cadastro
        </Button>
        <div className="w-full">
          {tabContents.filter((tab) => tab.key === activeTab)}
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "startups", title: "Startups" },
  { id: "mentors", title: "Mentores" },
];

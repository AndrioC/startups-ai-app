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
    <div className="h-auto bg-[#FCFCFC] rounded-lg shadow-lg relative w-full">
      <div className="flex items-center h-[90px] pl-5">
        <MdOutlineModeEditOutline className="h-6 w-6 text-black mr-2" />
        <div className="flex gap-10">
          <h1 className="text-2xl font-semibold text-black">{title}</h1>
          <h1 className="ml-4 text-2xl font-semibold text-black">
            Início: {start_date}
          </h1>
          <h1 className="ml-4 text-2xl font-semibold text-black">
            Fim: {end_date}
          </h1>
        </div>
      </div>
      <div className="flex mb-1">
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
      <div className="bg-gray-300 mb-4"></div>
      <div className="p-5">
        <Button
          onClick={handleCopyLink}
          className="flex items-center border-[#2292EA] bg-transparent border-2 text-[#2292EA] font-medium uppercase text-[13px] rounded-[30px] w-[250px] h-[30px] hover:bg-transparent hover:text-[#1f7dc5] transition-colors duration-300 ease-in-out"
        >
          <MdInsertLink className="h-8 w-8 mr-1 text-[#2292EA]" />
          Copiar link para cadastro
        </Button>
        <div className="h-screen w-[1300px] flex-wrap">
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

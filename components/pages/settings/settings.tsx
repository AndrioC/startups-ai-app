"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import ExternalPageSettings from "./external-page/external-page";
import GeneralTab from "./general";

const tabs = [
  { id: "general", title: "Geral" },
  { id: "external-page", title: "Página externa" },
];

export default function SettingsComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabQuery = searchParams.get("tab");
  const defaultTab = "general";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col relative w-full">
        <div className="flex overflow-x-auto whitespace-nowrap border-b">
          {tabs.map((tab, index) => (
            <div key={index} className="relative">
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
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex-grow p-4 sm:p-5 overflow-y-auto">
          <div className="w-full">
            {activeTab === "general" && <GeneralTab />}

            {activeTab === "external-page" && <ExternalPageSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

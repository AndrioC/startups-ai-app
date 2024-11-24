"use client";

import React, { useEffect, useState } from "react";
import { PageType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import Spinner from "@/components/spinner";
import { ExternalPageSettingsProvider } from "@/contexts/FormExternalPageSettings";

import ExternalPageSettings from "./external-page/external-page";
import GeneralTab from "./general";

export default function SettingsComponent() {
  const t = useTranslations("admin.settings");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const tabs = [
    { id: "general", title: t("general.title") },
    { id: "external-page", title: t("externalPage.title") },
  ];

  const tabQuery = searchParams.get("tab");
  const defaultTab = "general";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    data: externalPageSettings,
    refetch: refetchExternalPageSettings,
    isLoading: isLoadingExternalPageSettings,
    isRefetching: isRefetchingExternalPageSettings,
  } = useLoadExternalPageSettings(
    Number(session?.user?.organization_id),
    PageType.ORGANIZATION
  );

  const [mountExternalPageSettings, setMountExternalPageSettings] =
    useState(false);

  useEffect(() => {
    if (activeTab === "external-page" && !mountExternalPageSettings) {
      setMountExternalPageSettings(true);
    }
  }, [activeTab]);

  if (isLoadingExternalPageSettings) {
    return <Spinner isLoading={true}>{""}</Spinner>;
  }

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

            {mountExternalPageSettings && (
              <ExternalPageSettingsProvider
                initialData={externalPageSettings}
                refetch={refetchExternalPageSettings}
                isRefetching={isRefetchingExternalPageSettings}
              >
                {activeTab === "external-page" && <ExternalPageSettings />}
              </ExternalPageSettingsProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const useLoadExternalPageSettings = (
  organization_id: number,
  pageType: PageType
) =>
  useQuery<any>({
    queryKey: ["list-kanbans-with-cards-by-program-token"],
    queryFn: () =>
      axios
        .get(
          `/api/settings/${organization_id}/load-external-page-settings?pageType=${pageType}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!organization_id || !!pageType,
  });

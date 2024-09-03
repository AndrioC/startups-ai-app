"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

import globalLinkOpenLogo from "@/assets/img/logos/sri-logo.svg";
import HeaderExternalStartupComponent from "@/components/external/startup/header";
import StartupDataCard from "@/components/external/startup/startup-data-card";
import StartupForm from "@/components/external/startup/startup-form";
import StartupMatchesCard from "@/components/external/startup/startup-matches-card";
import StatusRegisterCard from "@/components/external/startup/status-register-card";
import { FormStartupProvider } from "@/contexts/FormStartupContext";

export default function StartupPage() {
  const { data: session } = useSession();

  const { data, refetch, isRefetching, isLoading } = useInitialData(
    Number(session?.user?.actor_id)
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-10 mb-10">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <HeaderExternalStartupComponent
        logoSrc={globalLinkOpenLogo}
        logoAlt="sri-logo"
      />
      <main className="flex flex-grow mt-[40px]">
        <aside className="w-[300px] flex-shrink-0 ml-[54px] flex flex-col gap-4">
          <StatusRegisterCard
            filledPercentages={data.filledPercentages}
            isRefetching={isRefetching}
          />
          <StartupDataCard
            data={{ ...data.blocks.generalData, ...data.blocks.team }}
          />
          <StartupMatchesCard />
        </aside>
        <section className="flex-grow flex justify-center items-center mx-[45px]">
          <FormStartupProvider
            initialData={{
              ...data.blocks.generalData,
              ...data.blocks.team,
              ...data.blocks.productService,
              ...data.blocks.deepTech,
              ...data.blocks.governance,
              ...data.blocks.marketFinance,
              ...data.blocks.profile,
            }}
            refetch={refetch}
            actorId={Number(session?.user?.actor_id)}
            isRefetching={isRefetching}
            programsData={data.programasData}
          >
            <StartupForm />
          </FormStartupProvider>
        </section>
      </main>
    </div>
  );
}

const useInitialData = (startup_id: number) =>
  useQuery<any>({
    queryKey: ["startup-initial-data", startup_id],
    queryFn: () =>
      axios
        .get(`/api/startup/load-startup-info-by-id/${startup_id}`)
        .then((res) => {
          return res.data;
        }),
    enabled: !!startup_id,
  });

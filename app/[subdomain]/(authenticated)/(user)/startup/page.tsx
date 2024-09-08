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
import LoadingSpinner from "@/components/loading-spinner";
import { FormStartupProvider } from "@/contexts/FormStartupContext";

export default function StartupPage() {
  const { data: session, status } = useSession();
  const actorId = session?.user?.actor_id;

  const { data, refetch, isRefetching, isLoading } = useInitialData(
    actorId ? Number(actorId) : undefined
  );

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <HeaderExternalStartupComponent
        logoSrc={globalLinkOpenLogo}
        logoAlt="sri-logo"
        userName={session.user?.name || ""}
      />
      <main className="flex flex-grow mt-[40px]">
        <aside className="w-[300px] flex-shrink-0 ml-[54px] flex flex-col gap-4">
          <StatusRegisterCard
            filledPercentages={data?.filledPercentages}
            isRefetching={isRefetching}
          />
          <StartupDataCard
            data={{ ...data?.blocks?.generalData, ...data?.blocks?.team }}
          />
          <StartupMatchesCard />
        </aside>
        <section className="flex-grow flex justify-center items-center mx-[45px]">
          {data && (
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
              actorId={Number(actorId)}
              isRefetching={isRefetching}
              programsData={data.programasData}
            >
              <StartupForm />
            </FormStartupProvider>
          )}
        </section>
      </main>
    </div>
  );
}

const useInitialData = (startup_id: number | undefined) =>
  useQuery<any>({
    queryKey: ["startup-initial-data", startup_id],
    queryFn: () =>
      axios
        .get(`/api/startup/load-startup-info-by-id/${startup_id}`)
        .then((res) => res.data),
    enabled: !!startup_id,
  });

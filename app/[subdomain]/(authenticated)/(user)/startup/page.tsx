"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import HeaderExternalStartupComponent from "@/components/external/startup/header";
import StartupDataCard from "@/components/external/startup/startup-data-card";
import StartupForm from "@/components/external/startup/startup-form";
import StartupMatchesCard from "@/components/external/startup/startup-matches-card";
import StartupPrograms from "@/components/external/startup/startup-programs";
import StatusRegisterCard from "@/components/external/startup/status-register-card";
import LoadingSpinner from "@/components/loading-spinner";
import { FormStartupProvider } from "@/contexts/FormStartupContext";

export default function StartupPage() {
  const { data: session, status } = useSession();
  const { subdomain } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const actorId = session?.user?.actor_id;

  const { data, refetch, isRefetching, isLoading } = useInitialData(
    actorId ? Number(actorId) : undefined
  );

  const tabQuery = searchParams.get("tab") || "register";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      handleTabChange("register");
    }
  }, []);

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
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
          <HeaderExternalStartupComponent
            logoAlt={`${subdomain}-logo`}
            userName={session.user?.name || ""}
          />
          <main className="flex flex-grow mt-[40px]">
            <aside className="w-[300px] flex-shrink-0 ml-[30px] flex flex-col gap-4">
              <StatusRegisterCard
                filledPercentages={data?.filledPercentages}
                isRefetching={isRefetching}
              />
              <StartupDataCard
                data={{ ...data?.blocks?.generalData, ...data?.blocks?.team }}
              />
              <StartupMatchesCard />
            </aside>
            <section className="flex-grow flex flex-col mx-[45px]">
              <div className="w-full h-[1500px] bg-[#F1F3F3] rounded-lg shadow-lg mb-10 relative">
                <div className="flex mb-1">
                  {["register", "programs"].map((tab) => (
                    <div key={tab} className="relative">
                      <button
                        onClick={() => handleTabChange(tab)}
                        className={`px-4 py-2 text-sm ${
                          tabQuery === tab
                            ? "bg-gray-300 rounded-t-lg text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {tab === "register" ? "Cadastro" : "Programas"}
                      </button>
                      {tabQuery === tab && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-[-5px] left-0 w-full h-1 bg-gray-400"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full h-[1px] bg-gray-300"></div>
                <div className="flex-grow">
                  {tabQuery === "register" && <StartupForm />}
                  {tabQuery === "programs" && <StartupPrograms />}
                </div>
              </div>
            </section>
          </main>
        </FormStartupProvider>
      )}
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

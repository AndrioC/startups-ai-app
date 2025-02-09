"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

import EnterpriseForm from "@/components/external/enterprise/enteprise-form";
import EnterpriseDataCard from "@/components/external/enterprise/enterprise-data-card";
// import HeaderExternalEnterpriseComponent from "@/components/external/enterprise/header";
// import StatusRegisterCard from "@/components/external/enterprise/status-register-card";
import LoadingSpinner from "@/components/loading-spinner";
import { FormEnterpriseProvider } from "@/contexts/FormEnterpriseContext";

export default function EnterprisePage() {
  const { data: session, status } = useSession();
  const actorId = session?.user?.actor_id;

  const { data, refetch, isRefetching, isLoading } = useInitialData(
    actorId ? Number(actorId) : undefined
  );

  if (status === "loading" || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {data && (
        <FormEnterpriseProvider
          initialData={{
            ...data.blocks.generalData,
            ...data.blocks.responsibleData,
            ...data.blocks.enterpriseData,
            ...data.blocks.governmentData,
            ...data.blocks.collegeData,
            ...data.blocks.objectivesData,
            ...data.blocks.statusData,
          }}
          refetch={refetch}
          actorId={Number(actorId)}
          isRefetching={isRefetching}
        >
          {/* <HeaderExternalEnterpriseComponent
            logoAlt={`${subdomain}-logo`}
            userName={session?.user?.name || ""}
          /> */}
          <main className="flex flex-grow mt-[40px]">
            <aside className="w-[300px] flex-shrink-0 ml-[30px] flex flex-col gap-4">
              {/* <StatusRegisterCard
                filledPercentages={data?.filledPercentages}
                isRefetching={isRefetching}
              /> */}
              <EnterpriseDataCard data={{ ...data?.blocks?.generalData }} />
            </aside>
            <section className="flex-grow flex flex-col mx-[45px]">
              <div className="w-full h-auto bg-[#F1F3F3] rounded-lg shadow-lg mb-10 relative">
                <EnterpriseForm />
              </div>
            </section>
          </main>
        </FormEnterpriseProvider>
      )}
    </div>
  );
}

const useInitialData = (enterprise_id: number | undefined) =>
  useQuery<any>({
    queryKey: ["enterprise-initial-data", enterprise_id],
    queryFn: () =>
      axios
        .get(`/api/enterprise/load-enterprise-info-by-id/${enterprise_id}`)
        .then((res) => res.data),
    enabled: !!enterprise_id,
  });

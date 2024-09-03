"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { SelectDataProps } from "@/components/external/startup/startup-form";
import StartupTab from "@/components/pages/startups/list/startup-tab";
import Spinner from "@/components/spinner";
import { FormStartupTabProvider } from "@/contexts/FormStartupTabContext";

export default function StartupDetailPage() {
  const { data: session } = useSession();

  const { token } = useParams();
  const { data, isLoading } = useLoadStartupInfoByToken(
    Number(session?.user?.organization_id),
    token?.toString()
  );

  const { data: selectData, isLoading: isLoadingSelectData } = useSelectData();

  if (isLoading || isLoadingSelectData)
    return (
      <div className="flex justify-center items-center mt-10 mb-10">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <Spinner isLoading={isLoading}>
      <FormStartupTabProvider
        initialData={{
          ...data.blocks.generalData,
          ...data.blocks.team,
          ...data.blocks.productService,
          ...data.blocks.deepTech,
          ...data.blocks.governance,
          ...data.blocks.marketFinance,
          ...data.blocks.profile,
        }}
        selectData={selectData!}
      >
        <StartupTab />
      </FormStartupTabProvider>
    </Spinner>
  );
}

const useLoadStartupInfoByToken = (organization_id: number, token: string) => {
  return useQuery<any>({
    queryKey: ["load-startup-info-by-token", token],
    queryFn: () =>
      axios
        .get(
          `/api/startup/${organization_id}/load-startup-info-by-token?token=${token}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!token || !!organization_id,
  });
};

const useSelectData = () =>
  useQuery<SelectDataProps>({
    queryKey: ["select-data"],
    queryFn: () =>
      axios.get("/api/selects-data").then((res) => {
        return res.data;
      }),
    staleTime: 5 * 60 * 1000,
  });

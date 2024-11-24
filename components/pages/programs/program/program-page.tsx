import { programs } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import Spinner from "@/components/spinner";

import HeaderProgramPage from "./header";

export default function ProgramPageComponent() {
  const { data: session } = useSession();
  const { token } = useParams();
  const t = useTranslations("admin.programs.programPage");

  const { data, error } = useLoadProgramInfo(
    Number(session?.user?.organization_id),
    token.toString()
  );

  if (!data || error || !session) {
    return (
      <div className="mt-[300px]">
        <Spinner isLoading={true}>{""}</Spinner>
      </div>
    );
  }

  const locale = t("locale");
  const dateFormat = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  } as const;

  const formatedStartDate = new Date(
    data?.programInfoByToken.start_date
  ).toLocaleDateString(locale, dateFormat);

  const formatedEndDate = new Date(
    data?.programInfoByToken.end_date
  ).toLocaleDateString(locale, dateFormat);

  return (
    <HeaderProgramPage
      title={data?.programInfoByToken.program_name!}
      start_date={formatedStartDate}
      end_date={formatedEndDate}
    />
  );
}

const useLoadProgramInfo = (organization_id: number, token: string) => {
  return useQuery<{ programInfoByToken: programs }>({
    queryKey: ["load-program-info-by-token"],
    queryFn: () =>
      axios
        .get(
          `/api/programs/${organization_id}/load-program-info-by-token?token=${token}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!token || !!organization_id,
  });
};

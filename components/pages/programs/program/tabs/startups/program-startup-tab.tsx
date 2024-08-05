import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { createRules } from "@/actions/rules";
import { KanbanDataWithCards } from "@/app/api/kanban/[organization_id]/load-kanbans-by-program-token/route";
import { SelectDataProps } from "@/components/external/startup/startup-form";
import KanbanComponent from "@/components/pages/programs/kanban/kanban-component";
import Spinner from "@/components/spinner";

export default function ProgramStartupTab() {
  const { token } = useParams();
  const { data: session } = useSession();
  const {
    data: kanbanData,
    refetch,
    isLoading,
  } = useLoadKanbanWithCards(
    Number(session?.user?.organization_id),
    token.toString()
  );

  const { data: selectData } = useSelectData();
  const rules = createRules(selectData!);

  if (!kanbanData || isLoading || !rules || !selectData) {
    return <Spinner isLoading={true}>{""}</Spinner>;
  }

  return (
    <KanbanComponent refetch={refetch} kanbanData={kanbanData} rules={rules} />
  );
}

const useLoadKanbanWithCards = (organization_id: number, token: string) =>
  useQuery<KanbanDataWithCards[]>({
    queryKey: ["list-kanbans-with-cards-by-program-token", token],
    queryFn: () =>
      axios
        .get(
          `/api/kanban/${organization_id}/load-kanbans-by-program-token?token=${token}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!organization_id || !!token,
  });

const useSelectData = () =>
  useQuery<SelectDataProps>({
    queryKey: ["select-data"],
    queryFn: () =>
      axios.get("/api/selects-data").then((res) => {
        return res.data;
      }),
    staleTime: 5 * 60 * 1000,
  });

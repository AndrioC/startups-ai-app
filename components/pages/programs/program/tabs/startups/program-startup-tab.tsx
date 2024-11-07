import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { createRules } from "@/actions/rules";
import { KanbanDataWithCards } from "@/app/api/kanban/[organization_id]/load-kanbans-by-program-token/route";
import { SelectDataProps } from "@/components/external/startup/startup-form";
import KanbanComponent from "@/components/pages/programs/kanban/kanban-component";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";

export default function ProgramStartupTab() {
  const { token } = useParams();
  const { data: session } = useSession();
  const {
    data: kanbanData,
    refetch: refetchKanban,
    isLoading: isLoadingKanban,
    isRefetching: isRefetchingKanban,
  } = useLoadKanbanWithCards(
    Number(session?.user?.organization_id),
    token?.toString()
  );

  const {
    data: selectData,
    refetch: refetchSelectData,
    isLoading: isLoadingSelectData,
    isRefetching: isRefetchingSelectData,
  } = useSelectData();

  const rules = createRules(selectData!);

  const isLoading = isLoadingKanban || isLoadingSelectData;
  const isRefetching = isRefetchingKanban || isRefetchingSelectData;

  const handleRefresh = () => {
    refetchKanban();
    refetchSelectData();
  };

  if (!kanbanData || isLoading || !rules || !selectData) {
    return <Spinner isLoading={true}>{""}</Spinner>;
  }

  return (
    <>
      <Spinner isLoading={isRefetching}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefetching}
            className="w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            {isRefetching ? "Recarregando..." : "Recarregar"}
          </Button>
        </div>
        <div className="w-full">
          <KanbanComponent
            refetch={refetchKanban}
            kanbanData={kanbanData}
            rules={rules}
          />
        </div>
      </Spinner>
    </>
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

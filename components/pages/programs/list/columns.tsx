"use client";

import { useState } from "react";
import { Badge, Tooltip } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { type ColumnDef } from "unstyled-table";

import { ProgramTable } from "@/app/api/programs/[organization_id]/list/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BusinessModelColors,
  getBadgeColorByApprovalStatus,
  getBadgeColorByBusinessModel,
} from "@/extras/utils";

export const programColumns: ColumnDef<ProgramTable, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Nome",
    accessorKey: "programName",
    header: "Nome",
    enableColumnFilter: false,
  },
  {
    id: "Início do programa",
    accessorKey: "startDate",
    header: "Início do programa",
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.original;
      const formattedDate = new Date(value.startDate).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "Fim do programa",
    accessorKey: "endDate",
    header: "Fim do programa",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.original;
      const formattedDate = new Date(value.endDate).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const program = row.original;
      return <ProgramActionsDropdown program={program} />;
    },
  },
];

const ProgramActionsDropdown = ({ program }: { program: ProgramTable }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  // const onSubmit = async () => {
  //   mutation.mutate();
  // };

  // const mutation = useMutation({
  //   mutationFn: () =>
  //     axios.patch(`/api/startup/update-startup-status/${startup.id}`, {
  //       is_approved: approvalValue,
  //     }),

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["startups"] });
  //   },
  // });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            role="button"
            onClick={() => onSubmit()}
          >
            {startup.is_approved ? "Reprove" : "Approve"}
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            role="button"
            onClick={() => setIsDialogOpen(true)}
          >
            Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[600px] overflow-y-auto min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes</DialogTitle>
          </DialogHeader>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <label htmlFor="startup" className="flex items-center">
              <span>Startup</span>
            </label>
            <input
              id="startup"
              value={startup.name}
              type="text"
              className="h-8 lg:h-11 px-4 border rounded-md"
              disabled
            />
            <label htmlFor="description" className="flex items-center">
              <span>Descrição</span>
            </label>
            <textarea
              id="description"
              value={startup.short_description}
              rows={4}
              className="px-4 border rounded-md resize-none h-[120px]"
              disabled
            />
            <label htmlFor="valueProposal" className="flex items-center">
              <span>Proposta de valor</span>
            </label>
            <textarea
              id="valueProposal"
              value={startup.value_proposal}
              rows={4}
              className="px-4 border rounded-md resize-none h-[120px]"
              disabled
            />
            <label htmlFor="problemSolved" className="flex items-center">
              <span>Problema que resolve</span>
            </label>
            <textarea
              id="problemSolved"
              value={startup.problem_that_is_solved}
              rows={4}
              className="px-4 border rounded-md resize-none h-[120px]"
              disabled
            />
            <label
              htmlFor="competitiveDifferentiator"
              className="flex items-center"
            >
              <span>Diferença dos competidores</span>
            </label>
            <textarea
              id="competitiveDifferentiator"
              value={startup.competitive_differentiator}
              rows={4}
              className="px-4 border rounded-md resize-none h-[120px]"
              disabled
            />
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Ok</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

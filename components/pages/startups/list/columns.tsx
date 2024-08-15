"use client";

import { Badge, Tooltip } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { type ColumnDef } from "unstyled-table";

import { type StartupTable } from "@/app/api/startup/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export const startupColumns: ColumnDef<StartupTable, unknown>[] = [
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
    id: "Startup",
    accessorKey: "name",
    header: "Startup",
    enableColumnFilter: false,
  },
  {
    id: "Vertical",
    accessorKey: "vertical",
    header: "Vertical",
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    id: "País",
    accessorKey: "country",
    header: "País",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const startup = row.original;

      return (
        <Tooltip content={startup.country}>
          <Image
            width={40}
            height={40}
            src={startup.country_flag}
            alt={`country-flag-${startup.country}`}
          />
        </Tooltip>
      );
    },
  },
  {
    id: "Mod. negócio",
    accessorKey: "business_model",
    header: "Mod. negócio",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const startup = row.original;

      return (
        <Badge
          className="w-[60px] flex items-center justify-center"
          color={
            getBadgeColorByBusinessModel(
              startup.business_model_code
            ) as BusinessModelColors[keyof BusinessModelColors]
          }
        >
          {startup.business_model}
        </Badge>
      );
    },
  },
  {
    id: "Estágio",
    accessorKey: "operation_stage",
    header: "Estágio",
    enableColumnFilter: false,
  },
  {
    id: "Fat. Ult. 12 meses",
    accessorKey: "last_twelve_months_revenue",
    header: "Fat. Ult. 12 meses",
    enableColumnFilter: false,
  },
  {
    id: "Status",
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: false,

    cell: ({ row }) => {
      const startup = row.original;

      return (
        <Badge
          className="w-[60px] flex items-center justify-center"
          color={
            getBadgeColorByApprovalStatus(
              startup.status
            ) as BusinessModelColors[keyof BusinessModelColors]
          }
        >
          {startup.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const startup = row.original;
      return <StartupActionsDropdown startup={startup} />;
    },
  },
];

const StartupActionsDropdown = ({ startup }: { startup: StartupTable }) => {
  const queryClient = useQueryClient();
  const approvalValue = startup.is_approved ? false : true;
  const onSubmit = async () => {
    mutation.mutate();
  };

  const mutation = useMutation({
    mutationFn: () =>
      axios.patch(`/api/startup/update-startup-status/${startup.id}`, {
        is_approved: approvalValue,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["startups"] });
    },
  });

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
          <DropdownMenuItem
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            role="button"
            onClick={() => onSubmit()}
          >
            {startup.is_approved ? "Reprove" : "Approve"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

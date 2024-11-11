"use client";

import { Badge, Tooltip } from "@radix-ui/themes";
import Image from "next/image";
import { type ColumnDef } from "unstyled-table";

import { StartupTable } from "@/app/api/startup/[organization_id]/load-startups-by-organization-id/route";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BusinessModelColors,
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
        aria-label="Select all."
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
];

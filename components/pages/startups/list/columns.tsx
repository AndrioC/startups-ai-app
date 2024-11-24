"use client";

import { Badge, Tooltip } from "@radix-ui/themes";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { StartupTable } from "@/app/api/startup/[organization_id]/load-startups-by-organization-id/route";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BusinessModelColors,
  getBadgeColorByBusinessModel,
} from "@/extras/utils";

export const StartupColumns = () => {
  const t = useTranslations("admin.startups.startupTable");

  const startupColumns: ColumnDef<StartupTable, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label={t("selectAll")}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label={t("selectRow")}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: t("startup"),
      accessorKey: "name",
      header: t("startup"),
      enableColumnFilter: false,
    },
    {
      id: t("vertical"),
      accessorKey: "vertical",
      header: t("vertical"),
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: t("country"),
      accessorKey: "country",
      header: t("country"),
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
      id: t("businessModel"),
      accessorKey: "business_model",
      header: t("businessModel"),
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
      id: t("stage"),
      accessorKey: "operation_stage",
      header: t("stage"),
      enableColumnFilter: false,
    },
    {
      id: t("revenueLast12Months"),
      accessorKey: "last_twelve_months_revenue",
      header: t("revenueLast12Months"),
      enableColumnFilter: false,
    },
  ];

  return startupColumns;
};

"use client";

import { toast } from "react-toastify";
import { Tooltip } from "@radix-ui/themes";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { StartupTable } from "@/app/api/startup/[organization_id]/load-startups-by-organization-id/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBadgeColorByBusinessModel } from "@/extras/utils";

interface StartupColumnsProps {
  refetchData?: () => void;
}

export const StartupColumns = ({ refetchData }: StartupColumnsProps) => {
  const t = useTranslations("admin.startups.startupTable");

  const handleApprovalUpdate = async (
    startupId: number,
    isApproved: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/startup/update-approve-status/${startupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ is_approved: isApproved }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("updateStatusError"));
      }

      toast.success(t(isApproved ? "approvalSuccess" : "rejectionSuccess"), {
        autoClose: 5000,
        position: "top-center",
      });

      await refetchData?.();

      return data;
    } catch (error) {
      console.error("Error updating startup approval status:", error);

      toast.error(t("statusUpdateErrorDescription"), {
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

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

        const color = getBadgeColorByBusinessModel(startup.business_model_code);

        if (!color) {
          return (
            <Badge className="w-[60px] flex items-center justify-center bg-transparent text-gray-500">
              -
            </Badge>
          );
        }

        return (
          <Badge
            variant={
              getBadgeColorByBusinessModel(startup.business_model_code) as any
            }
            className="w-[60px] flex items-center justify-center"
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
    {
      id: "status",
      header: t("status"),
      cell: ({ row }) => {
        const startup = row.original;
        return (
          startup.is_approved !== undefined && (
            <Badge
              className={`${
                startup.is_approved
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
              variant="outline"
            >
              {t(startup.is_approved ? "approved" : "rejected")}
            </Badge>
          )
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const startup = row.original;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t("openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {startup.is_approved ? (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleApprovalUpdate(startup.id, false)}
                  >
                    {t("reject")}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer text-green-500 hover:text-green-700"
                    onClick={() => handleApprovalUpdate(startup.id, true)}
                  >
                    {t("approve")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return startupColumns;
};

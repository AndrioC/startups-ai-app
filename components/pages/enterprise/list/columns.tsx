"use client";

import { toast } from "react-toastify";
import { Tooltip } from "@radix-ui/themes";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { EnterpriseTable } from "@/app/api/enterprise/[organization_id]/load-enterprise-by-organization-id-and-type/route";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnterpriseColumnsProps {
  refetchData?: () => void;
}

export const EnterpriseColumns = ({ refetchData }: EnterpriseColumnsProps) => {
  const t = useTranslations("admin.enterprise.enterpriseTable");
  const { data: session } = useSession();

  const handleApprovalUpdate = async (
    enterpriseId: number,
    isApproved: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/enterprise/${session?.user?.organization_id}/update-approve-status?enterpriseId=${enterpriseId}`,
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

      refetchData?.();

      return data;
    } catch (error) {
      console.error("Error updating enteprise approval status:", error);

      toast.error(t("statusUpdateErrorDescription"), {
        autoClose: 5000,
        position: "top-center",
      });
    }
  };

  const enterpriseColumns: ColumnDef<EnterpriseTable, unknown>[] = [
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
      id: t("name"),
      accessorKey: "name",
      header: t("name"),
      enableColumnFilter: false,
    },
    {
      id: t("country"),
      accessorKey: "country",
      header: t("country"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const enterprise = row.original;

        return (
          <Tooltip content={enterprise.country}>
            {enterprise.country_flag ? (
              <Image
                width={40}
                height={40}
                src={enterprise.country_flag}
                alt={`country-flag-${enterprise.country}`}
              />
            ) : (
              <span>-</span>
            )}
          </Tooltip>
        );
      },
    },

    {
      id: "status",
      header: t("status"),
      cell: ({ row }) => {
        const enterprise = row.original;
        return (
          enterprise.is_approved !== undefined && (
            <Badge
              className={`${
                enterprise.is_approved
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
              variant="outline"
            >
              {t(enterprise.is_approved ? "approved" : "rejected")}
            </Badge>
          )
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const enterprise = row.original;

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
                {enterprise.is_approved ? (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleApprovalUpdate(enterprise.id, false)}
                  >
                    {t("reject")}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer text-green-500 hover:text-green-700"
                    onClick={() => handleApprovalUpdate(enterprise.id, true)}
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

  return enterpriseColumns;
};

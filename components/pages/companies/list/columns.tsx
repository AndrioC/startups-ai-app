"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { CompanyTable } from "@/app/api/companies/[organization_id]/list/route";
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

import FormCompanyDialog from "../form-company-dialog";

export function useCompanyColumns() {
  const t = useTranslations("admin.companies.companyColumns");

  const companyColumns: ColumnDef<CompanyTable, unknown>[] = [
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
      id: t("name"),
      accessorKey: "companyName",
      header: t("name"),
      enableColumnFilter: false,
    },
    {
      id: t("registrationDate"),
      accessorKey: "createdAt",
      header: t("registrationDate"),
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.createdAt).toLocaleDateString(
          "en-US",
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
        const company = row.original;
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        return (
          <div onClick={(e) => e.stopPropagation()}>
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
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  role="button"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {t("edit")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <FormCompanyDialog
              company={company}
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
            />
          </div>
        );
      },
    },
  ];

  return companyColumns;
}

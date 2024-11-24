import { useCallback, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { ProgramTable } from "@/app/api/programs/[organization_id]/list/route";
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

import FormProgramDialog from "../form-program-dialog";

export const useProgramColumns = () => {
  const t = useTranslations("admin.programs.programColumns");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<
    ProgramTable | undefined
  >(undefined);

  const openDialog = useCallback((program: ProgramTable) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
  }, []);

  const columns: ColumnDef<ProgramTable, unknown>[] = [
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
      accessorKey: "programName",
      header: t("name"),
      enableColumnFilter: false,
    },
    {
      id: t("published"),
      accessorKey: "isPublished",
      header: t("published"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        return value.isPublished ? (
          <span className="px-2 py-1 text-sm font-medium text-green-800 bg-green-200 rounded-full">
            {t("yes")}
          </span>
        ) : (
          <span className="px-2 py-1 text-sm font-medium text-red-800 bg-red-200 rounded-full">
            {t("no")}
          </span>
        );
      },
    },
    {
      id: t("edital"),
      accessorKey: "editalFileUrl",
      header: t("edital"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        return value.editalFileUrl ? (
          <a
            href={value.editalFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t("openEdital")}
          </a>
        ) : (
          <span className="text-gray-400">{t("noFile")}</span>
        );
      },
    },
    {
      id: t("programStart"),
      accessorKey: "startDate",
      header: t("programStart"),
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.startDate).toLocaleDateString(
          undefined,
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
      id: t("programEnd"),
      accessorKey: "endDate",
      header: t("programEnd"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.endDate).toLocaleDateString(
          undefined,
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
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label={t("openMenu")}
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
                  onClick={() => openDialog(program)}
                >
                  {t("edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  role="button"
                >
                  {t("details")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return {
    columns,
    isDialogOpen,
    setIsDialogOpen,
    selectedProgram,
    FormProgramDialog,
  };
};

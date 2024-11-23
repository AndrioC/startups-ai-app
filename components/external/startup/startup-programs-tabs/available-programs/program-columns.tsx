"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormatter } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { ProgramTable } from "@/app/api/programs/[organization_id]/load-available-programs/route";

import StartupProgramModal from "./dialog-subscribe-program";

export function useProgramColumns(): ColumnDef<ProgramTable, unknown>[] {
  const t = useTranslations("programForm.availablePrograms.table");
  const format = useFormatter();

  return [
    {
      id: t("nameColumn"),
      accessorKey: "programName",
      header: t("nameColumn"),
      enableColumnFilter: false,
    },
    {
      id: t("startDateColumn"),
      accessorKey: "startDate",
      header: t("startDateColumn"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = format.dateTime(new Date(value.startDate), {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return <span>{formattedDate}</span>;
      },
    },
    {
      id: t("endDateColumn"),
      accessorKey: "endDate",
      header: t("endDateColumn"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = format.dateTime(new Date(value.endDate), {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return <span>{formattedDate}</span>;
      },
    },
    {
      id: t("fileColumn"),
      accessorKey: "editalFileUrl",
      header: t("fileColumn"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        if (value.editalFileUrl) {
          return (
            <a
              href={value.editalFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              {t("seeFile")}
            </a>
          );
        }
        return <span>{t("fileNotAvailable")}</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const program = row.original;
        return <StartupProgramModal program={program} />;
      },
    },
  ];
}

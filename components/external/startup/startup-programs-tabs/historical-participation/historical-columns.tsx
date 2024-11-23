"use client";

import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { HistoricalParticipationTable } from "@/app/api/startup/historical-participation/route";

export function useHistoricalColumns(): ColumnDef<
  HistoricalParticipationTable,
  unknown
>[] {
  const t = useTranslations("programForm.participationHistory.table");

  return [
    {
      id: t("nameColumn"),
      accessorKey: "program_name",
      header: t("nameColumn"),
      enableColumnFilter: false,
    },
    {
      id: t("subscriptionDate"),
      accessorKey: "joined_at",
      header: t("subscriptionDate"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.joined_at).toLocaleDateString(
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
      id: t("startDateColumn"),
      accessorKey: "start_date",
      header: t("startDateColumn"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.start_date).toLocaleDateString(
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
      id: t("endDateColumn"),
      accessorKey: "end_date",
      header: t("endDateColumn"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const value = row.original;
        const formattedDate = new Date(value.end_date).toLocaleDateString(
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
  ];
}

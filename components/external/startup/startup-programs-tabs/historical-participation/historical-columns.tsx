"use client";

import { type ColumnDef } from "unstyled-table";

import { HistoricalParticipationTable } from "@/app/api/startup/historical-participation/route";

export const historicalColumns: ColumnDef<
  HistoricalParticipationTable,
  unknown
>[] = [
  {
    id: "Nome do programa",
    accessorKey: "program_name",
    header: "Nome do programa",
    enableColumnFilter: false,
  },
  {
    id: "Data inscrição",
    accessorKey: "joined_at",
    header: "Data inscrição",
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
    id: "Início do Programa",
    accessorKey: "start_date",
    header: "Início do Programa",
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
    id: "Fim do Programa",
    accessorKey: "end_date",
    header: "Fim do Programa",
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

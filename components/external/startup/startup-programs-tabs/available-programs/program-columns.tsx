"use client";

import { ExternalLink } from "lucide-react";
import { type ColumnDef } from "unstyled-table";

import { ProgramTable } from "@/app/api/programs/[organization_id]/load-available-programs/route";

import StartupProgramModal from "./dialog-subscribe-program";

export const programColumns: ColumnDef<ProgramTable, unknown>[] = [
  {
    id: "Nome",
    accessorKey: "programName",
    header: "Nome",
    enableColumnFilter: false,
  },
  {
    id: "Início do Programa",
    accessorKey: "startDate",
    header: "Início do Programa",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.original;
      const formattedDate = new Date(value.startDate).toLocaleDateString(
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
    accessorKey: "endDate",
    header: "Fim do Programa",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const value = row.original;
      const formattedDate = new Date(value.endDate).toLocaleDateString(
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
    id: "Edital",
    accessorKey: "editalFileUrl",
    header: "Edital",
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
            Ver Edital
          </a>
        );
      }
      return <span>Não disponível</span>;
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

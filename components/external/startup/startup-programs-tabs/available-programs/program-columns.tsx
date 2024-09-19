"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { type ColumnDef } from "unstyled-table";

import { ProgramTable } from "@/app/api/programs/[organization_id]/load-available-programs/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const programColumns: ColumnDef<ProgramTable, unknown>[] = [
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
  //   {
  //     id: "Elegível",
  //     accessorKey: "isEligible",
  //     header: "Elegível",
  //     enableColumnFilter: false,
  //     cell: ({ row }) => {
  //       const value = row.original;
  //       return <span>{value.isEligible ? "Sim" : "Não"}</span>;
  //     },
  //   },
  {
    id: "actions",
    cell: ({ row }) => {
      const program = row.original;
      console.log("program: ", program);
      const [isEnrolling, setIsEnrolling] = useState(false);

      const handleEnroll = async () => {
        setIsEnrolling(true);
        setIsEnrolling(false);
      };

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="bg-white text-blue-600 border border-blue-600 shadow uppercase hover:bg-blue-50 transition-colors duration-300 ease-in-out"
          >
            {isEnrolling ? "Inscrevendo..." : "INSCREVER"}
          </Button>
        </div>
      );
    },
  },
];

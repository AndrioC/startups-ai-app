"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import sha1 from "crypto-js/sha1";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Table as ShadcnTable } from "unstyled-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StartupTable } from "../../../../app/api/startup/[organization_id]/load-startups-by-organization-id/route";

import { startupColumns } from "./columns";

interface ServerControlledTableProps {
  initialStartupsCount?: number;
}

interface ApiResponse {
  startups: StartupTable[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function StartupTableComponent({
  initialStartupsCount,
}: ServerControlledTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";

  const [isPending, startTransition] = React.useTransition();

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["startups", page, pageSize],
    queryFn: () =>
      axios
        .get(
          `/api/startup/${session?.user?.organization_id}/load-startups-by-organization-id?page=${page}&pageSize=${pageSize}`
        )
        .then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-5 sm:py-10">
      <ShadcnTable
        columns={startupColumns}
        data={data?.startups ?? []}
        itemsCount={data?.totalCount ?? initialStartupsCount ?? 0}
        manualPagination
        renders={{
          table: ({ children, tableInstance }) => {
            return (
              <div className="w-full p-1">
                <div className="flex items-center justify-between py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Colunas <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {tableInstance
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => {
                                column.toggleVisibility(!!value);
                              }}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <Table>{children}</Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          headerCell: ({ children, header }) => (
            <TableHead
              className="whitespace-nowrap bg-[#E5E7E7] text-sm sm:text-base font-semibold h-[55px]"
              onClick={() => {
                const isSortable = header.column.getCanSort();
                const nextSortDirection = header.column.getNextSortingOrder();
                isSortable &&
                  router.push(
                    `${pathname}?${createQueryString({
                      page: page,
                      sort: nextSortDirection ? header.column.id : null,
                      order: nextSortDirection ? nextSortDirection : null,
                    })}`
                  );
              }}
            >
              {children}
            </TableHead>
          ),
          body: ({ children }) => (
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={startupColumns.length} className="h-24">
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.startups.length ? (
                children
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={startupColumns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ),
          bodyRow: ({ children, row }) => (
            <TableRow
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                const url = `startups/startup/${sha1(row.original.id.toString()).toString()}`;

                if (e.metaKey || e.ctrlKey) {
                  window.open(url, "_blank");
                } else {
                  router.push(url);
                }
              }}
            >
              {children}
            </TableRow>
          ),
          bodyCell: ({ children }) => (
            <TableCell className="px-4 py-3 text-sm text-gray-700">
              {isPending ? <Skeleton className="h-6 w-full" /> : children}
            </TableCell>
          ),
          paginationBar: ({ tableInstance }) => {
            return (
              <div className="flex flex-col-reverse items-center gap-4 py-4 md:flex-row bg-gray-50 px-4 border-t border-gray-200">
                <div className="flex-1 text-sm font-medium text-gray-700">
                  {tableInstance.getFilteredSelectedRowModel().rows.length} de{" "}
                  {data?.totalCount ?? 0} linha(s) selecionada(s).
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Linhas por página
                    </span>
                    <Select
                      value={pageSize}
                      onValueChange={(value) => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: "1",
                              pageSize: value,
                            })}`
                          );
                        });
                      }}
                      disabled={isPending || isLoading}
                    >
                      <SelectTrigger className="h-8 w-16">
                        <SelectValue placeholder={pageSize} />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 30, 40, 50].map((item) => (
                          <SelectItem key={item} value={item.toString()}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {`Página ${data?.page ?? 1} de ${data?.totalPages ?? 1}`}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: "1",
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending || isLoading}
                    >
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Primeira página</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: (Number(page) - 1).toString(),
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending || isLoading}
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Página anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: (Number(page) + 1).toString(),
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={
                        Number(page) === (data?.totalPages ?? 1) ||
                        isPending ||
                        isLoading
                      }
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Próxima página</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: (data?.totalPages ?? 1).toString(),
                            pageSize,
                          })}`
                        );
                      }}
                      disabled={
                        Number(page) === (data?.totalPages ?? 1) ||
                        isPending ||
                        isLoading
                      }
                    >
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Última página</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}

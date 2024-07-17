"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Table as ShadcnTable } from "unstyled-table";

import { ExpertTable } from "@/app/api/experts/route";
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

import { startupColumns } from "./columns";

interface ServerControlledTableProps {
  expertsCount?: number;
}

export function ExpertTableComponent({
  expertsCount,
}: ServerControlledTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";

  const pageCount = Math.ceil(expertsCount! / Number(pageSize));

  const [isPending, startTransition] = React.useTransition();

  const { data, isLoading } = useQuery<ExpertTable[]>({
    queryKey: ["experts", page, pageSize],
    queryFn: () =>
      axios
        .get(`api/experts?page=${page}&pageSize=${pageSize}`)
        .then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

  // create query string
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
    <div className="min-h-screen px-32 py-10">
      <ShadcnTable
        columns={startupColumns}
        data={data ?? []}
        itemsCount={Number(pageSize)}
        manualPagination
        renders={{
          table: ({ children, tableInstance }) => {
            return (
              <div className="w-full p-1">
                <div className="flex items-center gap-2 py-4">
                  <div className="ml-auto flex items-center space-x-2">
                    {/* <Button
                      variant="destructive"
                      disabled={
                        !tableInstance.getSelectedRowModel().rows.length ||
                        isPending
                      }
                    >
                      Delete
                    </Button> */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                          Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                </div>
                <div className="rounded-md border">
                  <Table>{children}</Table>
                </div>
              </div>
            );
          },
          header: ({ children }) => <TableHeader>{children}</TableHeader>,
          headerRow: ({ children }) => <TableRow>{children}</TableRow>,
          headerCell: ({ children, header }) => (
            <TableHead
              className="whitespace-nowrap"
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
                Array.from({ length: Number(pageSize) }).map((_, index) => (
                  <TableRow key={index}>
                    {startupColumns.map((_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.length ? (
                children
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={startupColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ),
          bodyRow: ({ children }) => <TableRow>{children}</TableRow>,
          bodyCell: ({ children }) => (
            <TableCell>
              {isPending ? <Skeleton className="h-6 w-20" /> : children}
            </TableCell>
          ),
          paginationBar: ({ tableInstance }) => {
            return (
              <div className="flex flex-col-reverse items-center gap-4 py-4 md:flex-row">
                <div className="flex-1 text-sm font-medium">
                  {tableInstance.getFilteredSelectedRowModel().rows.length} of{" "}
                  {pageSize} row(s) selected.
                </div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium">Rows per page</span>
                    <Select
                      value={pageSize}
                      onValueChange={(value) => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page,
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
                  <div className="text-sm font-medium">
                    {`Page ${page} of ${pageCount ?? 10}`}
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
                              page: 1,
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending || isLoading}
                    >
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">First page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) - 1,
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={Number(page) === 1 || isPending || isLoading}
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        startTransition(() => {
                          router.push(
                            `${pathname}?${createQueryString({
                              page: Number(page) + 1,
                              pageSize,
                            })}`
                          );
                        });
                      }}
                      disabled={
                        Number(page) === (pageCount ?? 10) ||
                        isPending ||
                        isLoading
                      }
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Next page</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 px-0"
                      onClick={() => {
                        router.push(
                          `${pathname}?${createQueryString({
                            page: pageCount ?? 10,
                            pageSize,
                          })}`
                        );
                      }}
                      disabled={
                        Number(page) === (pageCount ?? 10) ||
                        isPending ||
                        isLoading
                      }
                    >
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Last page</span>
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

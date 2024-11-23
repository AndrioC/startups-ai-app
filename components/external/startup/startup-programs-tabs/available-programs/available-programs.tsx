"use client";

import * as React from "react";
import { programs } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Table as ShadcnTable } from "unstyled-table";

import { Button } from "@/components/ui/button";
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

import { useProgramColumns } from "./program-columns";

export interface ProgramQuery {
  orderBy: keyof programs;
  page: string;
  pageSize: string;
}

export function AvailableProgramsTab() {
  const t = useTranslations("programForm.availablePrograms.table");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";

  if (!session) {
    return null;
  }

  const { data, isLoading, isRefetching } = useLoadAllAvailablePrograms(
    Number(session?.user?.organization_id),
    Number(page),
    Number(pageSize)
  );

  const pageCount = Math.ceil(data?.programsCount! / Number(pageSize));

  const [isPending, startTransition] = React.useTransition();

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

  const programColumns = useProgramColumns();

  return (
    <div className="flex flex-col h-full w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-10">
      <ShadcnTable
        columns={programColumns}
        data={data?.programTable ?? []}
        itemsCount={Number(pageSize)}
        manualPagination
        renders={{
          table: ({ children }) => {
            return (
              <div className="w-full p-1">
                <div className="rounded-md border overflow-x-auto">
                  <Table>{children}</Table>
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
              {isLoading || isRefetching ? (
                <TableRow>
                  <TableCell colSpan={programColumns.length} className="h-24">
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.programTable?.length ? (
                children
              ) : !isRefetching &&
                !isLoading &&
                data?.programTable?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={programColumns.length}
                    className="h-24 text-center"
                  >
                    {t("noDataFound")}
                  </TableCell>
                </TableRow>
              ) : (
                Array.from({ length: Number(pageSize) }).map((_, index) => (
                  <TableRow key={index}>
                    {programColumns.map((_, columnIndex) => (
                      <TableCell key={columnIndex}>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          ),
          bodyRow: ({ children }) => <TableRow>{children}</TableRow>,
          bodyCell: ({ children }) => (
            <TableCell className="py-2 px-3 text-sm">
              {isPending || isLoading || isRefetching ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                children
              )}
            </TableCell>
          ),
          paginationBar: () => {
            return (
              <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
                <div className="flex-1 text-sm font-medium text-center sm:text-left"></div>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                  <div className="flex flex-wrap items-center space-x-2">
                    <span className="text-sm font-medium">
                      {t("resultsPerPage")}
                    </span>
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
                      disabled={isPending || isLoading || isRefetching}
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
                    {`${t("page")} ${page} ${t("of")} ${pageCount ?? 10}`}
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
                      disabled={
                        Number(page) === 1 ||
                        isPending ||
                        isLoading ||
                        isRefetching
                      }
                    >
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{t("firstPage")}</span>
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
                      disabled={
                        Number(page) === 1 ||
                        isPending ||
                        isLoading ||
                        isRefetching
                      }
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{t("previousPage")}</span>
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
                        isLoading ||
                        isRefetching
                      }
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{t("nextPage")}</span>
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
                        isLoading ||
                        isRefetching
                      }
                    >
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{t("lastPage")}</span>
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

const useLoadAllAvailablePrograms = (
  organization_id: number,
  page: number,
  pageSize: number
) =>
  useQuery<any>({
    queryKey: ["load-all-available-programs"],
    queryFn: () =>
      axios
        .get(
          `/api/programs/${organization_id}/load-available-programs?page=${page}&pageSize=${pageSize}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!organization_id,
  });

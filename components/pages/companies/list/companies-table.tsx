"use client";

import * as React from "react";
import { useState } from "react";
import { organizations } from "@prisma/client";
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
import { useTranslations } from "next-intl";
import { Table as ShadcnTable } from "unstyled-table";

import { CompanyTable } from "@/app/api/companies/[organization_id]/list/route";
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
import { FormCompanyProvider } from "@/contexts/FormCompanyContext";

import FormCompanyDialog from "../form-company-dialog";

import { useCompanyColumns } from "./columns";
import HeaderCompaniesFilter from "./header-companies-filter";

export interface CompanyQuery {
  orderBy: keyof organizations;
  page: string;
  pageSize: string;
}

export function CompaniesTableComponent() {
  const t = useTranslations("admin.companies.companiesTable");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const [companyName, setCompanyName] = useState<string>("");
  const [companyCreatedAt, setCompanyCreatedAt] = useState<Date | undefined>(
    undefined
  );

  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize") ?? "10";

  const { data, isLoading, isRefetching, refetch } = useListCompanies(
    Number(session?.user?.organization_id),
    Number(page),
    Number(pageSize),
    companyName,
    companyCreatedAt
  );

  const pageCount = Math.ceil(data?.companyCount! / Number(pageSize));

  const [isPending, startTransition] = React.useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const companyColumns = useCompanyColumns();
  return (
    <FormCompanyProvider
      initialData={data?.companyTable!}
      refetch={refetch}
      isRefetching={isRefetching}
    >
      <div className="flex flex-col h-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 py-5 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-5 sm:mb-10">
          <h1 className="text-center text-black font-semibold text-xl sm:text-2xl mb-4 sm:mb-0">
            {t("title")}
          </h1>
          <Button
            onClick={() => {
              setIsDialogOpen(true);
            }}
            variant="blue"
            className="bg-[#2292EA] text-white font-semibold uppercase text-base sm:text-lg rounded-full w-full sm:w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out"
          >
            + {t("newButton")}
          </Button>
        </div>
        <HeaderCompaniesFilter
          setCompanyName={setCompanyName}
          setCompanyCreatedAt={setCompanyCreatedAt}
          companyName={companyName}
          companyCreatedAt={companyCreatedAt}
        />
        <ShadcnTable
          columns={companyColumns}
          data={data?.companyTable ?? []}
          itemsCount={Number(pageSize)}
          manualPagination
          renders={{
            table: ({ children, tableInstance }) => {
              return (
                <div className="w-full p-1">
                  <div className="flex items-center gap-2 py-4">
                    <div className="ml-auto flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            {t("columns")}{" "}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
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
                    <TableCell colSpan={companyColumns.length} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.companyTable?.length ? (
                  children
                ) : !isRefetching &&
                  !isLoading &&
                  data?.companyTable?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={companyColumns.length}
                      className="h-24 text-center"
                    >
                      {t("noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  Array.from({ length: Number(pageSize) }).map((_, index) => (
                    <TableRow key={index}>
                      {companyColumns.map((_, columnIndex) => (
                        <TableCell key={columnIndex}>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            ),
            bodyRow: ({ children, row }) => (
              <TableRow
                className="cursor-pointer"
                onClick={() => {
                  router.push(
                    `companies/company/${sha1(
                      row.original.id.toString()
                    ).toString()}`
                  );
                }}
              >
                {children}
              </TableRow>
            ),
            bodyCell: ({ children }) => (
              <TableCell className="py-2 px-3 text-sm">
                {isPending || isLoading || isRefetching ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  children
                )}
              </TableCell>
            ),
            paginationBar: ({ tableInstance }) => {
              return (
                <div className="flex flex-col items-center gap-4 py-4 sm:flex-row">
                  <div className="flex-1 text-sm font-medium text-center sm:text-left">
                    {t("resultsSelected", {
                      selected:
                        tableInstance.getFilteredSelectedRowModel().rows.length,
                      total: pageSize,
                    })}
                  </div>
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
                      {t("pageInfo", { current: page, total: pageCount ?? 10 })}
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
        <FormCompanyDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      </div>
    </FormCompanyProvider>
  );
}

const useListCompanies = (
  organization_id: number,
  page: number,
  pageSize: number,
  companyName?: string,
  companyCreatedAt?: Date
) =>
  useQuery<{ companyTable: CompanyTable[]; companyCount: number }>({
    queryKey: ["list-companies", organization_id],
    queryFn: () =>
      axios
        .get(
          `/api/companies/${organization_id}/list?page=${page}&pageSize=${pageSize}&companyName=${companyName}&companyCreatedAt=${companyCreatedAt}`
        )
        .then((res) => {
          return res.data;
        }),
    staleTime: 5 * 60 * 1000,
    enabled: !!organization_id,
  });

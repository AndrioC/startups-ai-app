"use client";

import { useState } from "react";
import { SiLinkedin } from "react-icons/si";
import { Tooltip } from "@radix-ui/themes";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ColumnDef } from "unstyled-table";

import { ExpertTable } from "@/app/api/experts/[organization_id]/load-all-experts-by-organization-id/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function useExpertColumns() {
  const t = useTranslations("admin.mentors.mentorColumns");

  const StartupActionsDropdown = ({ expert }: { expert: ExpertTable }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
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
              onClick={() => setIsDialogOpen(true)}
            >
              {t("details")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[600px] overflow-y-auto min-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("details")}</DialogTitle>
            </DialogHeader>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-[120px] h-[120px] overflow-hidden rounded-full border-4 border-blue-600">
                  <Image
                    className="flex-shrink-0 object-center rounded-full"
                    width={120}
                    height={120}
                    src={expert.picture_img_url}
                    alt={`${expert.name}-image`}
                  />
                </div>
                <div className="flex mt-2">
                  <span className="text-xs font-semibold">{expert.name}</span>
                </div>
                <a href={expert.linkedin!} target="_blank" rel="noreferrer">
                  <SiLinkedin size={30} className="text-blue-500" />
                </a>
              </div>
              <label htmlFor="company" className="flex items-center">
                <span>{t("company")}</span>
              </label>
              <input
                id="company"
                value={expert.company!}
                type="text"
                className="h-8 lg:h-11 px-4 border rounded-md"
                disabled
              />
              <label
                htmlFor="startupsExperiencePt"
                className="flex items-center"
              >
                <span>{t("startupExperiencePt")}</span>
              </label>
              <textarea
                id="startupsExperiencePt"
                value={expert.experience_with_startups_pt}
                rows={4}
                className="px-4 border rounded-md resize-none h-[120px]"
                disabled
              />
              <label
                htmlFor="startupsExperienceEn"
                className="flex items-center"
              >
                <span>{t("startupExperienceEn")}</span>
              </label>
              <textarea
                id="startupsExperienceEn"
                value={expert.experience_with_startups_en}
                rows={4}
                className="px-4 border rounded-md resize-none h-[120px]"
                disabled
              />
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="blue">
                  {t("ok")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  const expertColumns: ColumnDef<ExpertTable, unknown>[] = [
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
      id: t("name"),
      accessorKey: "name",
      header: t("name"),
      enableColumnFilter: false,
    },
    {
      id: t("country"),
      accessorKey: "country",
      header: t("country"),
      enableColumnFilter: false,
      cell: ({ row }) => {
        const expert = row.original;

        return (
          <Tooltip content={expert.country}>
            <Image
              width={40}
              height={40}
              src={expert.country_flag}
              alt={`country-flag-${expert.country}`}
            />
          </Tooltip>
        );
      },
    },
    {
      id: t("stateCity"),
      accessorKey: "state_city",
      header: t("stateCity"),
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const expert = row.original;
        return <StartupActionsDropdown expert={expert} />;
      },
    },
  ];

  return { expertColumns, StartupActionsDropdown };
}

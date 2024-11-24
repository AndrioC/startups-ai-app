"use client";

import { useForm } from "react-hook-form";
import { Language } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

export default function DeepTechDataTab() {
  const { data: session } = useSession();
  const { initialData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.deepTechDataTab");

  const { register } = useForm({
    defaultValues: initialData,
  });

  const maturityLevelText =
    session?.user?.language === Language.PT_BR
      ? initialData?.maturityLevel?.name_pt
      : initialData?.maturityLevel?.name_en;

  const yesNoData = [
    {
      id: "yes",
      label: t("yes"),
    },
    {
      id: "no",
      label: t("no"),
    },
  ];

  const hasPatentLabel = initialData?.hasPatent
    ? yesNoData.find((option) => option.id === initialData.hasPatent)?.label
    : "";

  return (
    <form className="space-y-6">
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base">
          <div className="flex gap-10 mt-10">
            <div>
              <label htmlFor="maturityLevel" className="flex items-center mt-5">
                <span className="text-gray-500">{t("maturityLevel")}</span>
              </label>
              <textarea
                id="maturityLevel"
                value={maturityLevelText || ""}
                className="block pl-2 h-[50px] w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 resize-none overflow-hidden"
                disabled
                rows={4}
                style={{ height: "auto" }}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="hasPatent" className="flex items-center mt-5">
                <span className="text-gray-500">{t("hasPatent")}</span>
              </label>
              <input
                type="text"
                id="hasPatent"
                value={hasPatentLabel}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
          </div>
          <div>
            <label htmlFor="patentAndCode" className="flex items-center mt-5">
              <span className="text-gray-500">{t("patentDescription")}</span>
            </label>
            <textarea
              id="patentAndCode"
              rows={4}
              className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              maxLength={200}
              disabled
              {...register("patentAndCode")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

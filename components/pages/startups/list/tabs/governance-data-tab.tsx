"use client";

import { useTranslations } from "next-intl";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

export default function GovernanceDataTab() {
  const { initialData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.governanceDataTab");

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

  const getYesNoLabel = (value: string) => {
    return value
      ? yesNoData.find((option) => option.id === value)?.label || ""
      : "";
  };

  return (
    <form className="space-y-6">
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base">
          <div className="flex flex-col gap-5 mt-10">
            <div>
              <label
                htmlFor="isStartupOfficiallyRegistered"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("officiallyRegistered")}
                </span>
              </label>
              <input
                type="text"
                id="isStartupOfficiallyRegistered"
                value={getYesNoLabel(
                  initialData?.isStartupOfficiallyRegistered
                )}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="isTherePartnersAgreementSigned"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("partnersAgreement")}</span>
              </label>
              <input
                type="text"
                id="isTherePartnersAgreementSigned"
                value={getYesNoLabel(
                  initialData?.isTherePartnersAgreementSigned
                )}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="haveLegalAdvice"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("legalAdvice")}</span>
              </label>
              <input
                type="text"
                id="haveLegalAdvice"
                value={getYesNoLabel(initialData?.haveLegalAdvice)}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="haveAccountingConsultancy"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("accountingConsultancy")}
                </span>
              </label>
              <input
                type="text"
                id="haveAccountingConsultancy"
                value={getYesNoLabel(initialData?.haveAccountingConsultancy)}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="relationshipsRegisteredInContract"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("relationshipsRegistered")}
                </span>
              </label>
              <input
                type="text"
                id="relationshipsRegisteredInContract"
                value={getYesNoLabel(
                  initialData?.relationshipsRegisteredInContract
                )}
                className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

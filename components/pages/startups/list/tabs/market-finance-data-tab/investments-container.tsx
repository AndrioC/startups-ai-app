"use client";

import { Controller, FieldValues, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";

import { DatePicker } from "@/components/ui/date-picker";

type Props = {
  control: any;
  register: UseFormRegister<FieldValues>;
  index: number;
};

export default function InvestmentsContainer({
  control,
  register,
  index,
}: Props) {
  const t = useTranslations(
    "admin.startups.marketFinanceDataTab.investmentsContainer"
  );

  return (
    <div className="mb-4 border p-4 rounded-lg">
      <div className="flex flex-col w-full gap-2">
        <div className="mb-2 font-semibold text-gray-400">
          {index + 1}ª {t("round")}.
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col">
              <label
                htmlFor={`roundInvestmentStartDate[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("roundStart")}</span>
              </label>
              <Controller
                control={control}
                name={`investments[${index}].roundInvestmentStartDate`}
                render={({ field }) => (
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      field.onChange(newValue);
                    }}
                    value={field.value}
                    disabled
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`roundInvestmentEndDate[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("roundEnd")}</span>
              </label>
              <Controller
                control={control}
                name={`investments[${index}].roundInvestmentEndDate`}
                render={({ field }) => (
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      field.onChange(newValue);
                    }}
                    value={field.value}
                    disabled
                  />
                )}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`collectedTotal[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("totalInvestments")}</span>
              </label>
              <input
                id={`collectedTotal[${index}]`}
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register(`investments[${index}].collectedTotal`)}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <label
                htmlFor={`equityDistributedPercent[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("equityPercentage")}</span>
              </label>
              <input
                id={`equityDistributedPercent[${index}]`}
                type="number"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register(`investments[${index}].equityDistributedPercent`)}
              />
            </div>
            <div>
              <label
                htmlFor={`investorsQuantity[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("investorsCount")}</span>
              </label>
              <input
                id={`investorsQuantity[${index}]`}
                type="number"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register(`investments[${index}].investorsQuantity`)}
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <label
                htmlFor={`investors[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("investorsList")}</span>
              </label>
              <input
                id={`investors[${index}]`}
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register(`investments[${index}].investors`)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

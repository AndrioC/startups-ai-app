"use client";
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import InvestmentsContainer from "./investments-container";

export default function MarketFinanceDataTab() {
  const { initialData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.marketFinanceDataTab");

  const { register, control, watch } = useForm({
    defaultValues: initialData,
  });

  const alreadyEarning = watch("alreadyEarning");
  const isThereOpenInvestmentRound = watch("isThereOpenInvestmentRound");

  const { fields } = useFieldArray({
    control,
    name: "investments",
  });

  return (
    <form className="space-y-6">
      <div className="flex flex-col">
        <div className="flex flex-col text-xs lg:text-base w-full mt-5">
          <span className="text-gray-500 font-bold text-xl mb-5">
            {t("market")}
          </span>
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="payingCustomersQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("payingCustomers")}</span>
              </label>
              <input
                id="payingCustomersQuantity"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("payingCustomersQuantity")}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="activeCustomersQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("activeCustomers")}</span>
              </label>
              <input
                id="activeCustomersQuantity"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("activeCustomersQuantity")}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            {t("revenue")}
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                disabled
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
              checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                transition-colors duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("alreadyEarning")}
              />
              <label className="text-sm text-gray-500">
                {t("alreadyEarning")}
              </label>
            </div>
            {alreadyEarning && (
              <>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="lastRevenue" className="flex items-center">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("lastMonthRevenue")}
                      </span>
                    </label>
                    <input
                      id="lastRevenue"
                      type="text"
                      disabled
                      className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("lastRevenue")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastSixMonthsRevenue"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("lastSixMonthsRevenue")}
                      </span>
                    </label>
                    <input
                      id="lastSixMonthsRevenue"
                      type="text"
                      disabled
                      className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("lastSixMonthsRevenue")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastTwelveMonthsRevenue"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("lastTwelveMonthsRevenue")}
                      </span>
                    </label>
                    <input
                      id="lastTwelveMonthsRevenue"
                      type="text"
                      disabled
                      className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("lastTwelveMonthsRevenue")}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="saasCurrentRRM" className="flex items-center">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">{t("saasCurrentRRM")}</span>
                  </label>
                  <input
                    id="saasCurrentRRM"
                    type="text"
                    disabled
                    className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                    {...register("saasCurrentRRM")}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            {t("investments")}
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                disabled
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
              checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                transition-colors duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed"
                {...register("isThereOpenInvestmentRound")}
              />
              <label className="text-sm text-gray-500">
                {t("openInvestmentRound")}
              </label>
            </div>
            {isThereOpenInvestmentRound && (
              <>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="valueCollection"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("valueToBeRaised")}
                      </span>
                    </label>
                    <input
                      id="valueCollection"
                      type="text"
                      disabled
                      className="block w-[250px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("valueCollection")}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="equityPercentage"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("equityPercentage")}
                      </span>
                    </label>
                    <input
                      id="equityPercentage"
                      type="number"
                      disabled
                      className="block w-[250px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("equityPercentage", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="currentStartupValuation"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("currentValuation")}
                      </span>
                    </label>
                    <input
                      id="currentStartupValuation"
                      type="text"
                      disabled
                      className="block w-[250px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      {...register("currentStartupValuation")}
                    />
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="roundStartDate"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">{t("roundStart")}</span>
                    </label>
                    <Controller
                      control={control}
                      name="roundStartDate"
                      render={({ field }) => {
                        let dateValue: Date | undefined;
                        if (field.value) {
                          dateValue =
                            typeof field.value === "string"
                              ? new Date(field.value)
                              : field.value;
                        }

                        return (
                          <DatePicker
                            onChange={(newValue) => field.onChange(newValue)}
                            value={dateValue}
                            disabled
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="roundEndDate" className="flex items-center">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">{t("roundEnd")}</span>
                    </label>
                    <Controller
                      control={control}
                      name="roundEndDate"
                      render={({ field }) => {
                        return (
                          <DatePicker
                            onChange={(newValue) => field.onChange(newValue)}
                            value={field.value || undefined}
                            disabled
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            {t("receivedInvestments")}
          </span>
          {fields.map((investment, index) => (
            <InvestmentsContainer
              key={investment.id}
              index={index}
              control={control}
              register={register as unknown as UseFormRegister<FieldValues>}
            />
          ))}
        </div>
      </div>
    </form>
  );
}

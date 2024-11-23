"use client";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { FinanceAndMarketDataSchema } from "@/lib/schemas/schema-startup";

import InvestmentsContainer from "./investments-container";
import ValuationListModal from "./valuation-list-modal";
export default function MarketFinanceDataForm() {
  const t = useTranslations("startupForm.marketFinanceForm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { initialData, refetch, actorId } = useFormStartupDataState();

  const schemateste = FinanceAndMarketDataSchema(t);

  const {
    register,
    control,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schemateste>>({
    resolver: zodResolver(schemateste),
    defaultValues: initialData,
  });

  const alreadyEarning = watch("alreadyEarning");
  const isThereOpenInvestmentRound = watch("isThereOpenInvestmentRound");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "investments",
  });

  const onSubmit = async (data: z.infer<typeof schemateste>) => {
    const currentValues = getValues();
    if (isEqual(currentValues, initialData)) {
      toast.warning(t("noChanges"));
      return;
    }
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schemateste>) => {
      try {
        setIsSubmitting(true);
        const response = await axios.patch(
          `/api/startup-form/market-finance-data/${actorId}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setIsSubmitting(false);
          refetch();
        }
      } catch (error) {
        console.log("error: ", error);
      }
      setIsSubmitting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startup-initial-data", actorId],
      });
    },
  });

  const handleGenerateValuationClick = () => {
    toast.info(t("marketSection.generateValuation.disabled"));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <div className="flex flex-col text-xs lg:text-base w-full mt-5">
          <div className="flex justify-between items-center mb-5">
            <span className="text-gray-500 font-bold text-xl">
              {t("marketSection.title")}
            </span>
            <div className="flex flex-col">
              <Button
                type="button"
                variant="outline"
                className="whitespace-nowrap bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 uppercase"
                onClick={handleGenerateValuationClick}
              >
                <Sparkles size={20} />
                {t("marketSection.generateValuation.label")}
              </Button>
              <Button
                variant="link"
                className="text-blue-500 hover:text-blue-700 text-xs uppercase"
                onClick={() => setIsModalOpen(true)}
                disabled
              >
                {t("marketSection.viewGeneratedValuations.label")}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="payingCustomersQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("marketSection.payingCostumers")}
                </span>
              </label>
              <input
                id="payingCustomersQuantity"
                type="text"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register("payingCustomersQuantity")}
              />
              {errors.payingCustomersQuantity?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.payingCustomersQuantity.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="activeCustomersQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("marketSection.activeCustomers")}
                </span>
              </label>
              <input
                id="activeCustomersQuantity"
                type="text"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register("activeCustomersQuantity")}
              />
              {errors.activeCustomersQuantity?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.activeCustomersQuantity.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5 uppercase">
            {t("revenueSection.title")}
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                {...register("alreadyEarning")}
              />
              <label className="text-sm text-gray-500">
                {t("revenueSection.alreadyEarningLabel")}
              </label>
            </div>
            {alreadyEarning && (
              <>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="lastRevenue" className="flex items-center">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500 w-[200px]">
                        {t("revenueSection.lastMonthRevenueLabel")}
                      </span>
                    </label>
                    <input
                      id="lastRevenue"
                      type="text"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("lastRevenue")}
                    />
                    {errors.lastRevenue?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.lastRevenue.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastSixMonthsRevenue"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("revenueSection.last6MonthsRevenueLabel")}
                      </span>
                    </label>
                    <input
                      id="lastSixMonthsRevenue"
                      type="text"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("lastSixMonthsRevenue")}
                    />
                    {errors.lastSixMonthsRevenue?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.lastSixMonthsRevenue.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastTwelveMonthsRevenue"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("revenueSection.last12MonthsRevenueLabel")}
                      </span>
                    </label>
                    <input
                      id="lastTwelveMonthsRevenue"
                      type="text"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("lastTwelveMonthsRevenue")}
                    />
                    {errors.lastTwelveMonthsRevenue?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.lastTwelveMonthsRevenue.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="saasCurrentRRM" className="flex items-center">
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">
                      {t("revenueSection.saasCurrentRRMLabel")}
                    </span>
                  </label>
                  <input
                    id="saasCurrentRRM"
                    type="text"
                    className="border pl-2 rounded-md w-[270px] h-[40px]"
                    {...register("saasCurrentRRM")}
                  />
                  {errors.saasCurrentRRM?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.saasCurrentRRM.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5 uppercase">
            {t("investmentsSection.title")}
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                {...register("isThereOpenInvestmentRound")}
              />
              <label className="text-sm text-gray-500">
                {t("investmentsSection.hasOpenRoundLabel")}
              </label>
            </div>
            {isThereOpenInvestmentRound && (
              <>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="valueCollection"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("investmentsSection.roundInvestmentAmountLabel")}
                      </span>
                    </label>
                    <input
                      id="valueCollection"
                      type="text"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("valueCollection")}
                    />
                    {errors.valueCollection?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.valueCollection.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="equityPercentage"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("investmentsSection.equityPercentageLabel")}
                      </span>
                    </label>
                    <input
                      id="equityPercentage"
                      type="number"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("equityPercentage", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.equityPercentage?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.equityPercentage.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="currentStartupValuation"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("investmentsSection.currentStartupValuationLabel")}
                      </span>
                    </label>
                    <input
                      id="currentStartupValuation"
                      type="text"
                      className="border pl-2 rounded-md w-[270px] h-[40px]"
                      {...register("currentStartupValuation")}
                    />
                    {errors.currentStartupValuation?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.currentStartupValuation.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label
                      htmlFor="roundStartDate"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("investmentsSection.roundStartDateLabel")}
                      </span>
                    </label>
                    <Controller
                      control={control}
                      name="roundStartDate"
                      render={({ field }) => {
                        if (field.value && typeof field.value === "string") {
                          field.value = new Date(field.value);
                        } else if (field.value === undefined) {
                          field.value = undefined;
                        }

                        return (
                          <DatePicker
                            onChange={(newValue) => field.onChange(newValue)}
                            value={field.value || undefined}
                            className="w-[270px]"
                          />
                        );
                      }}
                    />
                    {errors.roundStartDate && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.roundStartDate?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="roundEndDate" className="flex items-center">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("investmentsSection.roundEndDateLabel")}
                      </span>
                    </label>
                    <Controller
                      control={control}
                      name="roundEndDate"
                      render={({ field }) => {
                        return (
                          <DatePicker
                            onChange={(newValue) => field.onChange(newValue)}
                            value={field.value || undefined}
                          />
                        );
                      }}
                    />
                    {errors.roundEndDate && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.roundEndDate?.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5 uppercase">
            {t("receivedInvestmentsSection.title")}
          </span>
          {fields.map((investment, index) => (
            <InvestmentsContainer
              key={investment.id}
              index={index}
              control={control}
              register={register as unknown as UseFormRegister<FieldValues>}
              remove={remove}
              errors={errors}
            />
          ))}
          <div>
            <button
              type="button"
              onClick={() =>
                append({
                  roundInvestmentStartDate: undefined,
                  roundInvestmentEndDate: undefined,
                  collectedTotal: "",
                  equityDistributedPercent: "",
                  investorsQuantity: "",
                  investors: "",
                })
              }
              className="mt-4 text-gray-500 border p-2 rounded-md hover:bg-gray-200"
            >
              {t("investmentsSection.addRoundButton")}
            </button>
          </div>
        </div>
        <ValuationListModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <div className="flex justify-end absolute bottom-10 right-5">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="px-6 text-white rounded-md"
        >
          {t("saveButton")}
        </Button>
      </div>
      {isSubmitting && (
        <div className="absolute inset-0 flex justify-center bg-white bg-opacity-70">
          <div className="w-[300px] mt-[20%] h-[90px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-2 gap-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
            <div className="text-xs text-center font-bold text-gray-500">
              {t("savingData")}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

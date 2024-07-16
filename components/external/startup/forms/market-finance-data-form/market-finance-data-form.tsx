"use client";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { FinanceAndMarketDataSchema } from "@/lib/schemas/schema-startup";

import InvestmentsContainer from "./investments-container";
export default function MarketFinanceDataForm() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const { initialData, refetch } = useFormStartupDataState();

  const schemateste = FinanceAndMarketDataSchema();

  const {
    register,
    control,
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
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof schemateste>) => {
      try {
        setIsSubmiting(true);
        const response = await axios.patch(
          `/api/startup-form/market-finance-data/${182}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setIsSubmiting(false);
          refetch();
        }
      } catch (error) {
        console.log("error: ", error);
      }
      setIsSubmiting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startup-initial-data", 182],
      });
    },
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <div className="flex flex-col text-xs lg:text-base w-full mt-5">
          <span className="text-gray-500 font-bold text-xl mb-5">MERCADO</span>
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="payingCustomersQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Quantos clientes pagantes possui?
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
                <span className="text-gray-500">Total de clientes ativos</span>
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
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            FATURAMENTO
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                {...register("alreadyEarning")}
              />
              <label className="text-sm text-gray-500">
                Já estou faturando
              </label>
            </div>
            {alreadyEarning && (
              <>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="lastRevenue" className="flex items-center">
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        Qual foi o faturamento do último mês?
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
                        Qual foi o faturamento dos últimos 6 meses?
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
                        Qual foi o faturamento dos últimos 12 meses?
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
                      Em caso de SaaS, informe o RRM atual
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
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            INVESTIMENTOS
          </span>
          <div className="flex flex-col gap-5">
            <div className="mb-3 flex items-center">
              <input
                type="checkbox"
                className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                {...register("isThereOpenInvestmentRound")}
              />
              <label className="text-sm text-gray-500">
                Existe uma rodada de investimento em aberto
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
                        Qual o valor a ser captado?
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
                        Qual percentual de equity a ser distribuído?
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
                        Qual o valuation atual da Startup?
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
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor="roundStartDate"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">Início da rodada</span>
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
                      <span className="text-gray-500">Fim da rodada</span>
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
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            INVESTIMENTOS RECEBIDOS
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
              + Adicionar Rodada
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end absolute bottom-10 right-5">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmiting}
          className="px-6 text-white rounded-md"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}

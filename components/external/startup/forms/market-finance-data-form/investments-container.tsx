"use client";

import {
  Controller,
  FieldErrors,
  FieldValues,
  UseFormRegister,
} from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { z } from "zod";

import { DatePicker } from "@/components/ui/date-picker";
import { InvestmentSchema } from "@/lib/schemas/schema-startup";

type Investiment = z.infer<typeof InvestmentSchema>;

type Props = {
  control: any;
  register: UseFormRegister<FieldValues>;
  remove: (index: number) => void;
  index: number;
  errors: FieldErrors<{
    investments: Investiment[];
  }>;
};

export default function InvestmentsContainer({
  control,
  register,
  remove,
  index,
  errors,
}: Props) {
  return (
    <div className="mb-4 border p-4 rounded-lg">
      <div className="flex flex-col w-full gap-2">
        <div className="mb-2 font-semibold text-gray-400">
          {index + 1}ª Rodada.
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="flex flex-col">
              <label
                htmlFor={`roundInvestmentStartDate[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Início da rodada</span>
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
                  />
                )}
              />
              {errors?.investments?.[index]?.roundInvestmentStartDate && (
                <p className="mt-2 text-sm text-red-500">
                  {
                    errors?.investments[index]?.roundInvestmentStartDate
                      ?.message
                  }
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`roundInvestmentEndDate[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Fim da rodada</span>
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
                  />
                )}
              />
              {errors?.investments?.[index]?.roundInvestmentEndDate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors?.investments[index]?.roundInvestmentEndDate?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor={`collectedTotal[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Total dos investimentos captados
                </span>
              </label>
              <input
                id={`collectedTotal[${index}]`}
                type="text"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register(`investments[${index}].collectedTotal`)}
              />
              {errors?.investments?.[index]?.collectedTotal && (
                <p className="mt-2 text-sm text-red-500">
                  {errors?.investments[index]?.collectedTotal?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <label
                htmlFor={`equityDistributedPercent[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Percentual de equities distribuídos
                </span>
              </label>
              <input
                id={`equityDistributedPercent[${index}]`}
                type="number"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register(`investments[${index}].equityDistributedPercent`)}
              />
              {errors?.investments?.[index]?.equityDistributedPercent && (
                <p className="mt-2 text-sm text-red-500">
                  {
                    errors?.investments[index]?.equityDistributedPercent
                      ?.message
                  }
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`investorsQuantity[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Quantos investidores possuem?
                </span>
              </label>
              <input
                id={`investorsQuantity[${index}]`}
                type="number"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register(`investments[${index}].investorsQuantity`)}
              />
              {errors?.investments?.[index]?.investorsQuantity && (
                <p className="mt-2 text-sm text-red-500">
                  {errors?.investments[index]?.investorsQuantity?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <div>
              <label
                htmlFor={`investors[${index}]`}
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Ventures e/ou investidores da rodada
                </span>
              </label>
              <input
                id={`investors[${index}]`}
                type="text"
                className="border pl-2 rounded-md w-[270px] h-[40px]"
                {...register(`investments[${index}].investors`)}
              />
              {errors?.investments?.[index]?.investors && (
                <p className="mt-2 text-sm text-red-500">
                  {errors?.investments[index]?.investors?.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => remove(index)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

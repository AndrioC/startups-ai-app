"use client";
import {
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";
import { TeamDataSchema } from "@/lib/schemas/schema-startup";

import PartnersContainer from "./partners-container";

export default function TeamDataTab() {
  const { initialData, selectData } = useFormStartupTabDataState();
  const formSchema = TeamDataSchema();

  const { register, control } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(TeamDataSchema()),
    defaultValues: initialData,
  });

  const { fields, remove } = useFieldArray({
    control,
    name: "partners",
  });

  const employeesQuantityData = [
    {
      id: 1,
      value: "1 - 5",
      label: "1 a 5",
    },
    {
      id: 2,
      value: "6 - 10",
      label: "6 a 10",
    },
    {
      id: 3,
      value: "11 - 30",
      label: "11 a 30",
    },
    {
      id: 4,
      value: "31 - 50",
      label: "31 a 50",
    },
    {
      id: 5,
      value: "more than 50",
      label: "Mais de 50",
    },
  ];

  const sortedEmployeesQuantityData = employeesQuantityData
    ?.slice()
    .sort((a, b) => {
      const labelA = a.id;
      const labelB = b.id;

      if (labelA < labelB) {
        return -1;
      }

      if (labelA > labelB) {
        return 1;
      }

      return 0;
    });

  const positionData = selectData?.position.map((value) => ({
    ...value,
    label: value.name,
  }));

  const sortedPositionData = positionData?.slice().sort((a, b) => {
    const labelA = a.label.toUpperCase();
    const labelB = b.label.toUpperCase();

    if (labelA < labelB) {
      return -1;
    }

    if (labelA > labelB) {
      return 1;
    }

    return 0;
  });

  return (
    <form className="space-y-6">
      <div className="flex flex-col">
        <div className="flex flex-col text-xs lg:text-base w-full mt-5">
          <span className="text-gray-500 font-bold text-xl mb-5">
            RESPONSÁVEL
          </span>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <label
                htmlFor="mainResponsibleName"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Nome do responsável pela Startup
                </span>
              </label>
              <input
                id="mainResponsibleName"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("mainResponsibleName")}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="contactNumber" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Telefone do responsável pela Startup
                </span>
              </label>
              <input
                id="contactNumber"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("contactNumber")}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="mainResponsibleEmail"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  E-mail do responsável pela Startup
                </span>
              </label>
              <input
                id="mainResponsibleEmail"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("mainResponsibleEmail")}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full">
          <span className="text-gray-500 font-bold text-xl mb-5 mt-5">
            EQUIPE
          </span>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="employeesQuantity" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Quantos funcionários trabalham na Startup?
                </span>
              </label>
              <select
                id="employeesQuantity"
                {...register("employeesQuantity")}
                disabled
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value={initialData.employeesQuantity}>
                  {
                    sortedEmployeesQuantityData.find(
                      (option: { id: number; label: string; value: string }) =>
                        option.value === initialData.employeesQuantity
                    )?.label
                  }
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="fullTimeEmployeesQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Quantas pessoas da equipe estão 100% envolvidas na Startup?
                </span>
              </label>
              <input
                id="fullTimeEmployeesQuantity"
                type="number"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("fullTimeEmployeesQuantity")}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs lg:text-base w-full h-[1500px] overflow-y-auto">
          <span className="text-gray-500 font-bold text-xl mt-5">SÓCIOS</span>
          <p className="text-gray-500 mb-5">
            Adicione todas as pessoas e empresas que fazem parte do Captable da
            sociedade.
          </p>
          {fields.map((partner, index) => (
            <PartnersContainer
              key={partner.id}
              index={index}
              register={register as unknown as UseFormRegister<FieldValues>}
              remove={remove}
              sortedPositionData={sortedPositionData!}
            />
          ))}
        </div>
      </div>
    </form>
  );
}

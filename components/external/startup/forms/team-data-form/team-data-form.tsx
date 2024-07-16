"use client";
import { useState } from "react";
import {
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
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { TeamDataSchema } from "@/lib/schemas/schema-startup";

import { SelectDataProps } from "../../startup-form";

import PartnersContainer from "./partners-container";

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}

export default function TeamDataForm({ data }: Props) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const { initialData, refetch } = useFormStartupDataState();
  const formSchema = TeamDataSchema();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(TeamDataSchema()),
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
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

  const positionData: ValueProps[] = data.position.map((value) => ({
    ...value,
    label: value.name,
  }));

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmiting(true);
        const response = await axios.patch(
          `/api/startup-form/team-data/${182}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === 201) {
          setIsSubmiting(false);
          refetch();
          return;
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
                className="border rounded-md w-[270px] h-[40px] pl-2"
                {...register("mainResponsibleName")}
              />
              {errors.mainResponsibleName?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.mainResponsibleName.message}
                </p>
              )}
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
                className="border rounded-md w-[270px] h-[40px] pl-2"
                {...register("contactNumber")}
              />
              {errors.contactNumber?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.contactNumber.message}
                </p>
              )}
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
                className="border rounded-md w-[270px] h-[40px] pl-2"
                {...register("mainResponsibleEmail")}
              />
              {errors.mainResponsibleEmail?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.mainResponsibleEmail.message}
                </p>
              )}
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
                className="block pl-2 w-[270px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value=""></option>
                {sortedEmployeesQuantityData.map(
                  (option: { id: number; label: string; value: string }) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors.employeesQuantity?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.employeesQuantity.message}
                </p>
              )}
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
                className="border rounded-md w-[270px] h-[40px] pl-2"
                {...register("fullTimeEmployeesQuantity")}
              />
              {errors.fullTimeEmployeesQuantity?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.fullTimeEmployeesQuantity.message}
                </p>
              )}
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
              errors={errors}
              sortedPositionData={sortedPositionData}
            />
          ))}
          <div>
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  phone: "",
                  email: "",
                  position_id: "",
                  is_founder: "",
                  dedication_type: "",
                  percentage_captable: 0,
                  is_first_business: "",
                  linkedin_lattes: "",
                  has_experience_or_formation: "",
                  is_formation_complementary: "",
                })
              }
              className="mt-4 text-gray-500 border p-2 rounded-md hover:bg-gray-200"
            >
              + Adicionar Sócio
            </button>
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
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { DeepTechDataSchema } from "@/lib/schemas/schema-startup";

import { SelectDataProps } from "../startup-form";

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}
export default function DeepTechDataForm({ data }: Props) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const { initialData, refetch } = useFormStartupDataState();
  const formSchema = DeepTechDataSchema();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const trlData: ValueProps[] = data.maturity_level.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const yesNoData = [
    {
      id: "yes",
      label: "Sim",
    },
    {
      id: "no",
      label: "Não",
    },
  ];

  const sortedTrlData = trlData.slice().sort((a, b) => {
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
    const currentValues = getValues();
    if (isEqual(currentValues, initialData)) {
      return;
    }
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmiting(true);
        const response = await axios.patch(
          `/api/startup-form/deep-tech-data/${182}`,
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
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base">
          <div className="flex gap-10 mt-10">
            <div>
              <label htmlFor="maturityLevel" className="flex items-center mt-5">
                <span className="text-gray-500">
                  Nível de maturidade tecnológica
                </span>
              </label>
              <select
                id="maturityLevel"
                {...register("maturityLevel")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {sortedTrlData.map((option: any) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.maturityLevel?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.maturityLevel.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="hasPatent" className="flex items-center mt-5">
                <span className="text-gray-500">Possui patente?</span>
              </label>
              <select
                id="hasPatent"
                {...register("hasPatent")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.hasPatent?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.hasPatent.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="patentAndCode" className="flex items-center mt-5">
              <span className="text-gray-500">Descrição da(s) patente(s)</span>
            </label>
            <textarea
              id="patentAndCode"
              rows={4}
              className="pl-2 border rounded-md resize-none h-[150px] w-full"
              {...register("patentAndCode")}
            />
            {errors.patentAndCode?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.patentAndCode.message}
              </p>
            )}
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

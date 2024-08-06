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
import { GovernanceDataSchema } from "@/lib/schemas/schema-startup";
export default function GovernanceDataForm() {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const { initialData, refetch, actorId } = useFormStartupDataState();
  const formSchema = GovernanceDataSchema();

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

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
          `/api/startup-form/governance-data/${actorId}`,
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
          return;
        }
      } catch (error) {
        console.log("error: ", error);
      }
      setIsSubmiting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startup-initial-data", actorId],
      });
    },
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  A empresa está oficialmente registrada em seu país com um
                  contrato social?
                </span>
              </label>
              <select
                id="isStartupOfficiallyRegistered"
                {...register("isStartupOfficiallyRegistered")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.isStartupOfficiallyRegistered?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.isStartupOfficiallyRegistered.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="isTherePartnersAgreementSigned"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Existe um Acordo de Sócios assinados pelos sócios?
                </span>
              </label>
              <select
                id="isTherePartnersAgreementSigned"
                {...register("isTherePartnersAgreementSigned")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.isTherePartnersAgreementSigned?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.isTherePartnersAgreementSigned.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="haveLegalAdvice"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  A Startup possui uma assessoria jurídica?
                </span>
              </label>
              <select
                id="haveLegalAdvice"
                {...register("haveLegalAdvice")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.haveLegalAdvice?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.haveLegalAdvice.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="haveAccountingConsultancy"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  A Startup possui uma assessoria contábil?
                </span>
              </label>
              <select
                id="haveAccountingConsultancy"
                {...register("haveAccountingConsultancy")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.haveAccountingConsultancy?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.haveAccountingConsultancy.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="relationshipsRegisteredInContract"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Todas as relações com Clientes, Fornecedores, Parceiros e
                  Funcionários estão devidamente registrados em contrato?
                </span>
              </label>
              <select
                id="relationshipsRegisteredInContract"
                {...register("relationshipsRegisteredInContract")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.relationshipsRegisteredInContract?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.relationshipsRegisteredInContract.message}
                </p>
              )}
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
      </div>
    </form>
  );
}

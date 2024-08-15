"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";
import { GovernanceDataSchema } from "@/lib/schemas/schema-startup";
export default function GovernanceDataTab() {
  const { initialData } = useFormStartupTabDataState();
  const formSchema = GovernanceDataSchema();

  const { register } = useForm<z.infer<typeof formSchema>>({
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
                  A empresa está oficialmente registrada em seu país com um
                  contrato social?
                </span>
              </label>
              <select
                id="isStartupOfficiallyRegistered"
                {...register("isStartupOfficiallyRegistered")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";
import { DeepTechDataSchema } from "@/lib/schemas/schema-startup";

export default function DeepTechDataTab() {
  const { initialData, selectData } = useFormStartupTabDataState();
  const formSchema = DeepTechDataSchema();

  const { register } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const trlData = selectData?.maturity_level.map((value) => ({
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

  const sortedTrlData = trlData?.slice().sort((a, b) => {
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
                defaultValue={initialData.maturityLevel || ""}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
                disabled
              >
                <option value="">Selecione uma opção</option>
                {sortedTrlData?.map((option: { id: number; label: string }) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="hasPatent" className="flex items-center mt-5">
                <span className="text-gray-500">Possui patente?</span>
              </label>
              <select
                id="hasPatent"
                {...register("hasPatent")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
                disabled
              >
                <option value="">Selecione uma opção</option>
                {yesNoData?.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="patentAndCode" className="flex items-center mt-5">
              <span className="text-gray-500">Descrição da(s) patente(s)</span>
            </label>
            <textarea
              id="patentAndCode"
              rows={4}
              className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              maxLength={200}
              disabled
              {...register("patentAndCode")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

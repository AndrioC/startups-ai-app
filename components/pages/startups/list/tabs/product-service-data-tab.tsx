"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";
import { ProductServiceDataSchema } from "@/lib/schemas/schema-startup";

export default function ProductServiceDataTab() {
  const { initialData, selectData } = useFormStartupTabDataState();
  const formSchema = ProductServiceDataSchema();

  const {
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const serviceProductData = selectData?.service_products.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const sdgoalsData = [
    {
      id: 1,
      value: "none",
      label: "Nenhuma",
    },
    {
      id: 2,
      value: "1 or more",
      label: "1 ou mais",
    },
    {
      id: 3,
      value: "i don't know",
      label: "Não sei",
    },
  ];

  const sortedSdGoals = sdgoalsData?.slice().sort((a, b) => {
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

  const sortedServiceProduct = serviceProductData?.slice().sort((a, b) => {
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
            <div className="flex flex-col w-full">
              <label
                htmlFor="startupProductService"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  Escolha a opção que melhor descreve o que é comercializado na
                  sua Startup
                </span>
              </label>
              <div className="h-[80px] w-[600px] border rounded-lg border-gray-300 bg-transparent flex p-2 justify-between bg-red-200">
                <div>
                  {sortedServiceProduct?.slice(0, 2).map((option: any) => (
                    <div key={option.id} className="mb-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`startupProductService-${option.id}`}
                        value={option.id}
                        disabled
                        className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                      checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                        transition-colors duration-300 ease-in-out
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        {...register("startupProductService")}
                      />
                      <label
                        htmlFor={`startupProductService-${option.id}`}
                        className="text-sm text-gray-500"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  {sortedServiceProduct?.slice(2).map((option: any) => (
                    <div key={option.id} className="mb-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`startupProductService-${option.id}`}
                        value={option.id}
                        disabled
                        className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                      checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                        transition-colors duration-300 ease-in-out
                        disabled:opacity-50 disabled:cursor-not-allowed"
                        {...register("startupProductService")}
                      />
                      <label
                        htmlFor={`startupProductService-${option.id}`}
                        className="text-sm text-gray-500"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {errors.startupProductService?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.startupProductService.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="quantityOdsGoals"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">ODS atendidas</span>
              </label>
              <select
                id="quantityOdsGoals"
                {...register("quantityOdsGoals")}
                disabled
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value={initialData.quantityOdsGoals}>
                  {
                    sortedSdGoals.find(
                      (option: { id: number; label: string; value: string }) =>
                        option.value === initialData.quantityOdsGoals
                    )?.label
                  }
                </option>
              </select>
              {errors.quantityOdsGoals?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.quantityOdsGoals.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="problemThatIsSolved"
              className="flex items-center mt-5"
            >
              <span className="text-red-500">*</span>
              <span className="text-gray-500">
                Problemas e soluções que a Startup resolve
              </span>
            </label>
            <textarea
              id="problemThatIsSolved"
              rows={4}
              className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              maxLength={200}
              disabled
              {...register("problemThatIsSolved")}
            />
            {errors.problemThatIsSolved?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.problemThatIsSolved.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="competitors" className="flex items-center mt-5">
              <span className="text-red-500">*</span>
              <span className="text-gray-500">Lista de concorrentes</span>
            </label>
            <textarea
              id="competitors"
              rows={4}
              className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              maxLength={200}
              disabled
              {...register("competitors")}
            />
            {errors.competitors?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.competitors.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="competitiveDifferentiator"
              className="flex items-center mt-5"
            >
              <span className="text-red-500">*</span>
              <span className="text-gray-500">
                Quais são os diferenciais competitivos em relação aos seus
                concorrentes?
              </span>
            </label>
            <textarea
              id="competitiveDifferentiator"
              rows={4}
              className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              maxLength={200}
              disabled
              {...register("competitiveDifferentiator")}
            />
            {errors.competitiveDifferentiator?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.competitiveDifferentiator.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

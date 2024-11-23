"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Language } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { ProductServiceDataSchema } from "@/lib/schemas/schema-startup";

import { Button } from "../../../ui/button";
import { SelectDataProps } from "../startup-form";

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}
export default function ProductServiceDataForm({ data }: Props) {
  const t = useTranslations("startupForm.productServiceForm");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { initialData, refetch, actorId } = useFormStartupDataState();
  const formSchema = ProductServiceDataSchema(t);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const serviceProductData: ValueProps[] = data.service_products.map(
    (value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    })
  );

  const sdgoalsData = [
    {
      id: 1,
      value: "none",
      label: t("odsOptions.none"),
    },
    {
      id: 2,
      value: "1 or more",
      label: t("odsOptions.oneOrMore"),
    },
    {
      id: 3,
      value: "i don't know",
      label: t("odsOptions.dontKnow"),
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

  const sortedServiceProduct = serviceProductData.slice().sort((a, b) => {
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
      toast.warning(t("noChanges"));
      return;
    }
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        setIsSubmitting(true);
        const response = await axios.patch(
          `/api/startup-form/product-service-data/${actorId}`,
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
          return;
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base">
          <div className="flex gap-10 mt-10">
            <div className="flex flex-col w-full">
              <label
                htmlFor="startupProductService"
                className="flex items-center mt-5"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("productService")}</span>
              </label>
              <div className="h-[80px] w-[600px] border rounded-lg border-gray-300 bg-transparent flex p-2 justify-between bg-red-200">
                <div>
                  {sortedServiceProduct.slice(0, 2).map((option: any) => (
                    <div key={option.id} className="mb-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`startupProductService-${option.id}`}
                        value={option.id}
                        className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
                  {sortedServiceProduct.slice(2).map((option: any) => (
                    <div key={option.id} className="mb-3 flex items-center">
                      <input
                        type="checkbox"
                        id={`startupProductService-${option.id}`}
                        value={option.id}
                        className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
                <span className="text-gray-500">{t("odsGoals")}</span>
              </label>
              <select
                id="quantityOdsGoals"
                {...register("quantityOdsGoals")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">{t("selectOption")}</option>
                {sortedSdGoals.map(
                  (option: { id: number; label: string; value: string }) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  )
                )}
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
              <span className="text-gray-500">{t("problems")}</span>
            </label>
            <textarea
              id="problemThatIsSolved"
              rows={4}
              className="pl-2 border rounded-md resize-none h-[150px] w-full"
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
              <span className="text-gray-500">{t("competitors")}</span>
            </label>
            <textarea
              id="competitors"
              rows={4}
              className="pl-2 border rounded-md resize-none h-[150px] w-full"
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
              <span className="text-gray-500">{t("differentials")}</span>
            </label>
            <textarea
              id="competitiveDifferentiator"
              rows={4}
              className="pl-2 border rounded-md resize-none h-[150px] w-full"
              {...register("competitiveDifferentiator")}
            />
            {errors.competitiveDifferentiator?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.competitiveDifferentiator.message}
              </p>
            )}
          </div>
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
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
            <div className="w-[300px] mt-[20%] h-[90px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-2 gap-1">
              <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
              <div className="text-xs text-center font-bold text-gray-500">
                {t("savingData")}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

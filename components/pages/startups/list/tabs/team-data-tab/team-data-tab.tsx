"use client";
import {
  FieldValues,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { useTranslations } from "next-intl";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import PartnersContainer from "./partners-container";

export default function TeamDataTab() {
  const { initialData, selectData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.teamDataTab");

  const { register, control } = useForm({
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
      label: t("employeesQuantity.1-5"),
    },
    {
      id: 2,
      value: "6 - 10",
      label: t("employeesQuantity.6-10"),
    },
    {
      id: 3,
      value: "11 - 30",
      label: t("employeesQuantity.11-30"),
    },
    {
      id: 4,
      value: "31 - 50",
      label: t("employeesQuantity.31-50"),
    },
    {
      id: 5,
      value: "more than 50",
      label: t("employeesQuantity.moreThan50"),
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

  const employeesQuantityLabel =
    sortedEmployeesQuantityData.find(
      (option: { id: number; label: string; value: string }) =>
        option.value === initialData.employeesQuantity
    )?.label || "";

  return (
    <form className="space-y-6">
      <div className="flex flex-col">
        <div className="flex flex-col text-xs lg:text-base w-full mt-5">
          <span className="text-gray-500 font-bold text-xl mb-5">
            {t("responsible")}
          </span>
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <label
                htmlFor="mainResponsibleName"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("responsibleName")}</span>
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
                <span className="text-gray-500">{t("responsiblePhone")}</span>
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
                <span className="text-gray-500">{t("responsibleEmail")}</span>
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
            {t("team")}
          </span>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="employeesQuantity" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("employeesCount")}</span>
              </label>
              <input
                type="text"
                id="employeesQuantity"
                value={employeesQuantityLabel}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="fullTimeEmployeesQuantity"
                className="flex items-center"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("fullTimeEmployees")}</span>
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
          <span className="text-gray-500 font-bold text-xl mt-5">
            {t("partners")}
          </span>
          <p className="text-gray-500 mb-5">{t("partnersDescription")}</p>
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

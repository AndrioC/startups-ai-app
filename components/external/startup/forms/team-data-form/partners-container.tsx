"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FaTrash } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface Partner {
  name: string;
  phone: string;
  email: string;
  position_id: string;
  is_founder: string;
  dedication_type: string;
  percentage_captable: number;
  is_first_business: string;
  linkedin_lattes: string;
  has_experience_or_formation: string;
  is_formation_complementary: string;
}

type Props = {
  register: UseFormRegister<FieldValues>;
  remove: (index: number) => void;
  index: number;
  errors: FieldErrors<{
    partners: Partner[];
  }>;
  sortedPositionData: { id: number; label: string }[];
};

export default function PartnersContainer({
  register,
  remove,
  index,
  errors,
  sortedPositionData,
}: Props) {
  const t = useTranslations("startupForm.teamDataForm.partnersForm");
  const yesNoData = [
    {
      id: "yes",
      label: t("yesQuestion"),
    },
    {
      id: "no",
      label: t("noQuestion"),
    },
  ];

  const dedicationData = [
    {
      id: "fulltime",
      label: "Full-time",
    },
    {
      id: "partime",
      label: "Part-time",
    },
  ];

  return (
    <div className="mb-4 border p-4 rounded-lg">
      <div className="flex w-full gap-1">
        <div className="mb-2 font-semibold text-gray-400">{index + 1}.</div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between gap-2">
            <div>
              <label
                htmlFor={`name${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("name")}</span>
              </label>
              <input
                id={`name${index}`}
                type="text"
                {...register(`partners[${index}].name`)}
                className={`mt-1 pl-2 block w-[300px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors?.partners?.[index]?.name ? "border-red-500" : ""
                }`}
              />
              {errors?.partners?.[index]?.name && (
                <p className="mt-2 text-sm text-red-500">
                  {errors?.partners[index]?.name?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`phone${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("phone")}</span>
              </label>
              <input
                id={`phone${index}`}
                type="text"
                {...register(`partners[${index}].phone`)}
                className={`mt-1 pl-2 block w-[250px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors?.partners?.[index]?.phone ? "border-red-500" : ""
                }`}
              />
              {errors?.partners?.[index]?.phone && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.phone?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`email${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("email")}</span>
              </label>
              <input
                id={`email${index}`}
                type="email"
                {...register(`partners[${index}].email`)}
                className={`mt-1 pl-2 block w-[300px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors?.partners?.[index]?.email ? "border-red-500" : ""
                }`}
              />
              {errors?.partners?.[index]?.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.email?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor={`position_id${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("role")}</span>
              </label>
              <select
                id={`position_id${index}`}
                {...register(`partners[${index}].position_id`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.position_id ? "border-red-500" : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {sortedPositionData.map(
                  (option: { id: number; label: string }) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors?.partners?.[index]?.position_id && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.position_id?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`is_founder${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("founder")}</span>
              </label>
              <select
                id={`is_founder${index}`}
                {...register(`partners[${index}].is_founder`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.is_founder ? "border-red-500" : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.partners?.[index]?.is_founder && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.is_founder?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`dedication_type${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("dedication")}</span>
              </label>
              <select
                id={`dedication_type${index}`}
                {...register(`partners[${index}].dedication_type`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.dedication_type
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {dedicationData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.partners?.[index]?.dedication_type && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.dedication_type?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`percentage_captable${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("captable")}</span>
              </label>
              <input
                id={`percentage_captable${index}`}
                type="number"
                {...register(`partners[${index}].percentage_captable`, {
                  valueAsNumber: true,
                })}
                className={`pl-2 h-[40px] block w-[100px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors?.partners?.[index]?.percentage_captable
                    ? "border-red-500"
                    : ""
                }`}
              />
              {errors?.partners?.[index]?.percentage_captable && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.percentage_captable?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`is_first_business${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("firstBusiness")}</span>
              </label>
              <select
                id={`is_first_business${index}`}
                {...register(`partners[${index}].is_first_business`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.is_first_business
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.partners?.[index]?.is_first_business && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.is_first_business?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <label
                htmlFor={`linkedin_lattes${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("linkedinLattes")}</span>
              </label>
              <input
                id={`linkedin_lattes${index}`}
                type="text"
                {...register(`partners[${index}].linkedin_lattes`)}
                className={`pl-2 block w-[450px] h-[40px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors?.partners?.[index]?.linkedin_lattes
                    ? "border-red-500"
                    : ""
                }`}
              />
              {errors?.partners?.[index]?.linkedin_lattes && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.linkedin_lattes?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor={`has_experience_or_formation${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("experienceOrFormation")}
                </span>
              </label>
              <select
                id={`has_experience_or_formation${index}`}
                {...register(`partners[${index}].has_experience_or_formation`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.has_experience_or_formation
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.partners?.[index]?.has_experience_or_formation && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.has_experience_or_formation?.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <div>
              <label
                htmlFor={`is_formation_complementary${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                <span className="text-red-500">*</span>
                <span className="text-gray-500">
                  {t("experienceAndFormationComplementary")}
                </span>
              </label>
              <select
                id={`is_formation_complementary${index}`}
                {...register(`partners[${index}].is_formation_complementary`)}
                className={`block pl-2 w-[185px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 ${
                  errors?.partners?.[index]?.is_formation_complementary
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">{t("selectOption")}</option>
                {yesNoData.map((option: { id: string; label: string }) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.partners?.[index]?.is_formation_complementary && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.partners[index]?.is_formation_complementary?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-gray-500"
          onClick={() => remove(index)}
        >
          <FaTrash />
        </Button>
      </div>
    </div>
  );
}

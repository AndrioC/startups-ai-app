"use client";
import { Controller, useForm } from "react-hook-form";
import { Language } from "@prisma/client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import "react-image-crop/dist/ReactCrop.css";

interface ValueProps {
  id: number;
  label: string;
}

export default function GeneralDataTab() {
  const { data: session } = useSession();
  const { initialData, selectData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.generalDataTab");

  const verticalText =
    session?.user?.language === Language.PT_BR
      ? initialData?.vertical?.name_pt
      : initialData?.vertical?.name_en;

  const countryText =
    session?.user?.language === Language.PT_BR
      ? initialData?.country?.name_pt
      : initialData?.country?.name_en;

  const operationStageText =
    session?.user?.language === Language.PT_BR
      ? initialData?.operationalStage?.name_pt
      : initialData?.operationalStage?.name_en;

  const truncateFileName = (name: string, maxLength: number) => {
    if (name?.length <= maxLength) return name;
    return name?.slice(0, maxLength) + "...";
  };

  const { register, control } = useForm({
    defaultValues: initialData,
  });

  const challengesData: ValueProps[] = selectData?.challenges.map((value) => ({
    ...value,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }))!;

  const startupsObjectivesData: ValueProps[] = selectData?.objectives.map(
    (value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    })
  )!;

  const sortedChallengesData = challengesData?.slice().sort((a, b) => {
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

  const sortedStartupsObjectives = startupsObjectivesData
    ?.slice()
    .sort((a: any, b: any) => {
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

  const makeConnectionsOriginCountry = [
    {
      id: "yes",
      label: t("yes"),
    },
    {
      id: "no",
      label: t("no"),
    },
  ];

  const connectionLabel =
    makeConnectionsOriginCountry.find(
      (option: { id: string; label: string }) =>
        option.id === initialData.connectionsOnlyOnStartupCountryOrigin
    )?.label || "";

  return (
    <form className="space-y-6">
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base">
          <div className="flex gap-10 mt-10">
            <div className="flex flex-col">
              <label htmlFor="startupName" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("name")}</span>
              </label>
              <input
                id="startupName"
                type="text"
                disabled
                className="block w-[300px] h-[40px] rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("startupName")}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("country")}</span>
              </label>
              <input
                type="text"
                id="country"
                value={countryText || ""}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col">
              <label htmlFor="vertical" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("vertical")}</span>
              </label>
              <input
                type="text"
                id="vertical"
                value={verticalText || ""}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="stateAndCity" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("cityState")}</span>
              </label>
              <input
                id="stateAndCity"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("stateAndCity")}
                disabled
              />
            </div>
          </div>
          <div className="flex gap-10 mt-5">
            <div className="flex flex-col">
              <label htmlFor="operationalStage" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("operationalStage")}</span>
              </label>
              <input
                type="text"
                id="operationalStage"
                value={operationStageText || ""}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="businessModel" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("businessModel")}</span>
              </label>
              <input
                type="text"
                id="businessModel"
                value={initialData?.businessModel || ""}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col">
              <label htmlFor="subscriptionNumber" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("cnpj")}</span>
              </label>
              <input
                id="subscriptionNumber"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("subscriptionNumber")}
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="foundationDate" className="flex items-center">
                <div>
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">{t("foundationDate")}</span>
                </div>
              </label>
              <Controller
                control={control}
                name="foundationDate"
                render={({ field }) => (
                  <DatePicker
                    onChange={(newValue: Date | undefined) => {
                      field.onChange(newValue);
                    }}
                    value={field.value}
                    disabled={true}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col">
              <label htmlFor="referenceLink" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("website")}</span>
              </label>
              <input
                id="referenceLink"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                {...register("referenceLink")}
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="loadPitchDeck" className="flex items-center">
                <div className="flex flex-col">
                  <div>
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">{t("pitchdeck")}</span>
                  </div>
                </div>
              </label>
              <Controller
                name="loadPitchDeck"
                control={control}
                render={({ field: { ref, name, onBlur } }) => (
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={ref}
                      name={name}
                      id={name}
                      onBlur={onBlur}
                      accept=".pdf"
                      style={{ display: "none" }}
                    />
                    <div className="relative flex items-center space-x-2 font-medium">
                      <div className="flex items-center justify-between w-[300px]">
                        {initialData.loadPitchDeckUrl ? (
                          <span
                            className="text-blue-500 cursor-pointer"
                            title={initialData.loadPitchDeckUrl}
                            onClick={() =>
                              window.open(
                                initialData.loadPitchDeckUrl,
                                "_blank"
                              )
                            }
                          >
                            {truncateFileName(initialData.loadPitchDeckUrl, 30)}
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            {t("noPitchdeck")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10 ml-10">
          <label htmlFor="loadLogo" className="flex items-center">
            <div className="flex flex-col">
              <div>
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("logo")}</span>
              </div>
            </div>
          </label>
          <Controller
            name="loadLogo"
            control={control}
            render={({ field: { ref, name, onBlur } }) => (
              <div className="flex items-center space-x-2">
                <div className="relative w-48 h-48 bg-white">
                  <div className="logo-container">
                    <Image
                      alt="logo-image"
                      layout="fill"
                      objectFit="cover"
                      src={initialData.loadLogoUrl}
                    />
                  </div>
                </div>
                <input
                  type="file"
                  ref={ref}
                  name={name}
                  id={name}
                  onBlur={onBlur}
                  accept=".png, .jpeg, .jpg, .svg"
                  style={{ display: "none" }}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="startupChallenges" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <span className="text-gray-500">{t("challenges")}</span>
        </label>
        <div className="h-[400px] border rounded-lg border-gray-300 bg-transparent flex p-2 justify-between">
          <div className="w-[450px]">
            {sortedChallengesData
              .slice(0, 12)
              .map((option: { id: number; label: string }) => (
                <div key={option.id} className="mb-3 flex items-center">
                  <input
                    type="checkbox"
                    id={`challenge-${option.id}`}
                    value={option.id}
                    disabled
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                  checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                    transition-colors duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("startupChallenges")}
                  />
                  <label
                    htmlFor={`challenge-${option.id}`}
                    className="text-sm text-gray-500"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
          <div className="w-[400px]">
            {sortedChallengesData
              .slice(12)
              .map((option: { id: number; label: string }) => (
                <div key={option.id} className="mb-3 flex items-center">
                  <input
                    type="checkbox"
                    id={`challenge-${option.id}`}
                    value={option.id}
                    disabled
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                  checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                    transition-colors duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("startupChallenges")}
                  />
                  <label
                    htmlFor={`challenge-${option.id}`}
                    className="text-sm text-gray-500"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <label htmlFor="startupObjectives" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <span className="text-gray-500">{t("desiredConnections")}</span>
        </label>
        <div className="h-[120px] border rounded-lg border-gray-300 bg-transparent flex p-2 justify-between">
          <div className="w-[450px]">
            {sortedStartupsObjectives
              .slice(0, 3)
              .map((option: { id: number; label: string }) => (
                <div key={option.id} className="mb-3 flex items-center">
                  <input
                    type="checkbox"
                    id={`connection-${option.id}`}
                    value={option.id}
                    disabled
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                  checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                    transition-colors duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("startupObjectives")}
                  />
                  <label
                    htmlFor={`connection-${option.id}`}
                    className="text-sm text-gray-500"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
          <div className="w-[400px]">
            {sortedStartupsObjectives
              .slice(3)
              .map((option: { id: number; label: string }) => (
                <div key={option.id} className="mb-3 flex items-center">
                  <input
                    type="checkbox"
                    id={`connection-${option.id}`}
                    value={option.id}
                    disabled
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded 
                  checked:bg-blue-500 checked:border-0 cursor-pointer bg-white 
                    transition-colors duration-300 ease-in-out
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    {...register("startupObjectives")}
                  />
                  <label
                    htmlFor={`connection-${option.id}`}
                    className="text-sm text-gray-500"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        <label
          htmlFor="connectionsOnlyOnStartupCountryOrigin"
          className="flex items-center mt-5"
        >
          <span className="text-red-500">*</span>
          <span className="text-gray-500">
            {t("connectionsInOriginCountry")}
          </span>
        </label>
        <input
          type="text"
          id="connectionsOnlyOnStartupCountryOrigin"
          value={connectionLabel}
          className="block pl-2 min-w-[200px] w-fit max-w-[500px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs lg:text-base sm:leading-6 disabled:bg-gray-50 disabled:text-gray-500"
          disabled
          readOnly
        />
      </div>
      <div>
        <label htmlFor="valueProposal" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <span className="text-gray-500">{t("valueProposal")}</span>
        </label>
        <textarea
          id="valueProposal"
          rows={4}
          className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          maxLength={200}
          disabled
          {...register("valueProposal")}
        />
      </div>
      <div>
        <label htmlFor="shortDescription" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <div className="flex text-gray-500 items-center gap-3">
            <span>{t("startupDescription")}</span>
            <p className="text-xs">{t("startupDescriptionHint")}</p>
          </div>
        </label>
        <textarea
          id="shortDescription"
          rows={4}
          className="border rounded-md resize-none h-[150px] w-full pl-2 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          disabled
          {...register("shortDescription")}
        />
      </div>
    </form>
  );
}

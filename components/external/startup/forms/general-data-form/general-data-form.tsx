"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Language } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { Loader2, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import selectImagePlaceHolder from "@/assets/img/select-image-placeholder.png";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { GeneralDataSchema } from "@/lib/schemas/schema-startup";

import ImageCropDialog from "../../../image-crop-dialog";
import { SelectDataProps } from "../../startup-form";

import PitchdeckListModal from "./pitch-deck-list-modal";

import "react-image-crop/dist/ReactCrop.css";

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}

export default function GeneralDataForm({ data }: Props) {
  const t = useTranslations("startupForm.generalDataForm");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [localLogoFile, setLocalLogoFile] = useState<File | null>(null);
  const [localPitchDeckFile, setLocalPitchDeckFile] = useState<File | null>(
    null
  );

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  const { initialData, pitchDeckFile, logoFile, refetch, actorId } =
    useFormStartupDataState();
  const formSchema = GeneralDataSchema(t);

  const countriesData: ValueProps[] = data.country.map((value) => ({
    ...value,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }));

  const verticalData: ValueProps[] = data.vertical.map((value) => ({
    ...value,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }));

  const operationalStageData: ValueProps[] = data.operational_stage.map(
    (value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    })
  );

  const challengesData: ValueProps[] = data.challenges.map((value) => ({
    ...value,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }));

  const makeConnectionsOriginCountry = [
    { id: "yes", label: t("yesQuestion") },
    { id: "no", label: t("noQuestion") },
  ];

  const startupsObjectivesData: ValueProps[] = data.objectives.map((value) => ({
    ...value,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }));

  const sortedCountriesData = countriesData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  const sortedVerticalData = verticalData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  const sortedOperationalStage = operationalStageData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  const sortedBusinessModel = data.business_model
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const sortedChallengesData = challengesData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));
  const sortedStartupsObjectives = startupsObjectivesData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const currentValues = getValues();
    if (isEqual(currentValues, initialData)) {
      toast.warning("noChanges");
      return;
    }
    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const sendFormData = new FormData();
      sendFormData.append("file-logo", data.loadLogo!);
      sendFormData.append("file-pitch", data.loadPitchDeck!);
      sendFormData.append("data", JSON.stringify(data));
      try {
        setIsSubmitting(true);
        const response = await axios.patch(
          `/api/startup-form/general-data/${actorId}`,
          sendFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCroppedImage = (croppedImageBlob: Blob) => {
    const file = new File([croppedImageBlob], "cropped-image.png", {
      type: "image/png",
    });
    setLocalLogoFile(file);
    setValue("loadLogo", file);
  };

  const handleGeneratePitchDeckClick = () => {
    toast.info(t("pitchDeckNotAvailable"));
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-10">
        <div className="flex flex-col gap-1 text-xs lg:text-base w-2/3">
          <div className="flex gap-10 mt-10">
            <div className="flex flex-col w-1/2">
              <label htmlFor="startupName" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("startupName")}</span>
              </label>
              <input
                id="startupName"
                type="text"
                className="border rounded-md w-full h-[40px] pl-2"
                {...register("startupName")}
              />
              {errors.startupName?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.startupName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="country" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("country")}</span>
              </label>
              <select
                id="country"
                {...register("country")}
                className="block pl-2 w-full h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option value="">País</option>
                {sortedCountriesData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.country?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col w-1/2">
              <label htmlFor="vertical" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("vertical")}</span>
              </label>
              <select
                id="vertical"
                {...register("vertical")}
                className="block pl-2 w-full h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t("selectOption")}</option>
                {sortedVerticalData.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.vertical?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.vertical.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="stateAndCity" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("stateAndCity")}</span>
              </label>
              <input
                id="stateAndCity"
                type="text"
                className="border rounded-md w-full h-[40px] pl-2"
                {...register("stateAndCity")}
              />
              {errors.stateAndCity?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.stateAndCity.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col w-1/2">
              <label htmlFor="operationalStage" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("operationalStage")}</span>
              </label>
              <select
                id="operationalStage"
                {...register("operationalStage")}
                className="block pl-2 w-full h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t("selectOption")}</option>
                {sortedOperationalStage.map((option) => (
                  <option key={option.id} value={Number(option.id)}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.operationalStage?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.operationalStage.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="businessModel" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">{t("businessModel")}</span>
              </label>
              <select
                id="businessModel"
                {...register("businessModel")}
                className="block pl-2 w-full h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option value="">{t("selectOption")}</option>
                {sortedBusinessModel.map((option) => (
                  <option key={option.id} value={Number(option.id)}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors.businessModel?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.businessModel.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col w-1/2">
              <label htmlFor="subscriptionNumber" className="flex items-center">
                <span className="text-gray-500">{t("subscriptionNumber")}</span>
              </label>
              <input
                id="subscriptionNumber"
                type="text"
                className="border rounded-md w-full h-[40px] pl-2"
                {...register("subscriptionNumber")}
              />
              {errors.subscriptionNumber?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.subscriptionNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="foundationDate" className="flex items-center">
                <span className="text-gray-500">{t("foundationDate")}</span>
              </label>
              <Controller
                control={control}
                name="foundationDate"
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    onChange={(newValue: Date | undefined | null) => {
                      field.onChange(newValue);
                    }}
                    value={field.value}
                  />
                )}
              />
              {errors.foundationDate?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.foundationDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col w-full">
              <label htmlFor="referenceLink" className="flex items-center">
                <span className="text-gray-500">{t("referenceLink")}</span>
              </label>
              <input
                id="referenceLink"
                type="text"
                className="border rounded-md w-full h-[40px] pl-2"
                {...register("referenceLink")}
              />
              {errors.referenceLink?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.referenceLink.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-5">
            <label htmlFor="loadPitchDeck" className="flex items-center">
              <span className="text-red-500">*</span>
              <span className="text-gray-500">{t("pitchDeck")}</span>
            </label>
            <div className="flex items-center gap-20">
              <Controller
                name="loadPitchDeck"
                control={control}
                render={({ field: { ref, name, onBlur, onChange } }) => (
                  <div className="flex-grow">
                    <div className="flex items-center border rounded-lg p-2 bg-white">
                      <input
                        type="file"
                        ref={ref}
                        name={name}
                        id={name}
                        onBlur={onBlur}
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          setLocalPitchDeckFile(selectedFile || null);
                          onChange(selectedFile);
                        }}
                      />
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 flex-grow">
                          <span
                            className="text-blue-500 cursor-pointer truncate hover:underline"
                            title={
                              localPitchDeckFile
                                ? localPitchDeckFile.name
                                : getFileNameFromUrl(pitchDeckFile)
                            }
                            onClick={() => {
                              const fileUrl = localPitchDeckFile
                                ? URL.createObjectURL(localPitchDeckFile)
                                : pitchDeckFile;
                              if (fileUrl) window.open(fileUrl, "_blank");
                            }}
                          >
                            {truncateFileName(
                              localPitchDeckFile
                                ? localPitchDeckFile.name
                                : getFileNameFromUrl(pitchDeckFile) ||
                                    t("selectFile"),
                              30
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              document.getElementById(name)?.click()
                            }
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Upload className="w-4 h-4 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
              <div className="flex flex-col">
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 uppercase"
                  onClick={handleGeneratePitchDeckClick}
                  disabled
                >
                  <Sparkles size={20} />
                  {t("generatePitchDeck")}
                </Button>
                <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-700 text-xs uppercase"
                  onClick={() => setIsModalOpen(true)}
                  disabled
                >
                  {t("seeGeneratedPitchDeck")}
                </Button>
              </div>
            </div>
            {errors.loadPitchDeck?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.loadPitchDeck.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-10 w-1/3">
          <label htmlFor="loadLogo" className="flex items-center">
            <span className="text-red-500">*</span>
            <span className="text-gray-500">Logo</span>
          </label>
          <Controller
            name="loadLogo"
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
              <div className="flex items-center space-x-2">
                <div className="relative w-48 h-48 bg-white">
                  <div className="logo-container">
                    <Image
                      src={
                        localLogoFile
                          ? URL.createObjectURL(localLogoFile)
                          : logoFile || selectImagePlaceHolder
                      }
                      alt="logo-image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div
                    className="absolute bottom-0 left-0 flex items-center justify-center w-9 h-9 bg-gray-500 rounded-full cursor-pointer"
                    onClick={() => document.getElementById(name)?.click()}
                  >
                    <FaEdit className="text-white" />
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
                  onChange={(e) => {
                    handleImageSelect(e);
                    onChange(e.target.files?.[0]);
                  }}
                />
              </div>
            )}
          />
          {errors.loadLogo?.message && (
            <p className="mt-2 text-sm text-red-400">
              {errors.loadLogo.message}
            </p>
          )}
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
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
        {errors.startupChallenges?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.startupChallenges.message}
          </p>
        )}
      </div>

      <div className="flex flex-col w-full">
        <label htmlFor="startupObjectives" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <span className="text-gray-500">{t("objectives")}</span>
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
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
                    className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
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
        {errors.startupObjectives?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.startupObjectives.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="connectionsOnlyOnStartupCountryOrigin"
          className="flex items-center mt-5"
        >
          <span className="text-red-500">*</span>
          <span className="text-gray-500">{t("connections")}</span>
        </label>
        <select
          id="connectionsOnlyOnStartupCountryOrigin"
          {...register("connectionsOnlyOnStartupCountryOrigin")}
          className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
        >
          <option value="">{t("selectOption")}</option>
          {makeConnectionsOriginCountry.map(
            (option: { id: string; label: string }) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            )
          )}
        </select>
        {errors.connectionsOnlyOnStartupCountryOrigin?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.connectionsOnlyOnStartupCountryOrigin.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="valueProposal" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <span className="text-gray-500">
            {t("valueProposal")} {t("valueProposalMaxLength")}
          </span>
        </label>
        <textarea
          id="valueProposal"
          rows={4}
          className="border rounded-md resize-none h-[70px] w-full pl-2"
          maxLength={200}
          {...register("valueProposal")}
        />
        {errors.valueProposal?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.valueProposal.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="shortDescription" className="flex items-center mt-5">
          <span className="text-red-500">*</span>
          <div className="flex text-gray-500 items-center gap-3">
            <span>{t("shortDescription")}</span>
            <p className="text-xs">{t("shortDescriptionSubtitle")}</p>
          </div>
        </label>
        <textarea
          id="shortDescription"
          rows={4}
          className="border rounded-md resize-none h-[150px] w-full pl-2"
          {...register("shortDescription")}
        />
        {errors.shortDescription?.message && (
          <p className="mt-2 text-sm text-red-400">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
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

      <ImageCropDialog
        isOpen={isCropDialogOpen}
        setIsOpen={setIsCropDialogOpen}
        imageToCrop={imageToCrop}
        onCropComplete={handleCroppedImage}
      />
      <PitchdeckListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </form>
  );
}

const getFileNameFromUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  try {
    return url.split("/").pop() || "";
  } catch (error) {
    return "";
  }
};

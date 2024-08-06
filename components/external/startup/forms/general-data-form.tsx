"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import Image from "next/image";
import { z } from "zod";

import selectImagePlaceHolder from "@/assets/img/select-image-placeholder.png";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";
import { GeneralDataSchema } from "@/lib/schemas/schema-startup";

import { SelectDataProps } from "../startup-form";

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}
export default function GeneralDataForm({ data }: Props) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const queryClient = useQueryClient();
  const [localLogoFile, setLocalLogoFile] = useState<File | undefined>(
    undefined
  );
  const [localPitchDeckFile, setLocalPitchDeckFile] = useState<
    File | undefined
  >(undefined);

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  const { initialData, pitchDeckFile, logoFile, refetch, actorId } =
    useFormStartupDataState();
  const formSchema = GeneralDataSchema();

  const countriesData: ValueProps[] = data.country.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const verticalData: ValueProps[] = data.vertical.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const operationalStageData: ValueProps[] = data.operational_stage.map(
    (value) => ({
      ...value,
      label: value.name_pt,
    })
  );

  const challengesData: ValueProps[] = data.challenges.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const makeConnectionsOriginCountry = [
    {
      id: "yes",
      label: "Sim",
    },
    {
      id: "no",
      label: "Não",
    },
  ];

  const startupsObjectivesData: ValueProps[] = data.objectives.map((value) => ({
    ...value,
    label: value.name_pt,
  }));

  const sortedCountriesData = countriesData?.slice().sort((a, b) => {
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

  const sortedVerticalData = verticalData?.slice().sort((a, b) => {
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

  const sortedOperationalStage = operationalStageData?.slice().sort((a, b) => {
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

  const sortedBusinessModel = data.business_model.slice().sort((a, b) => {
    const labelA = a.name.toUpperCase();
    const labelB = b.name.toUpperCase();

    if (labelA < labelB) {
      return -1;
    }

    if (labelA > labelB) {
      return 1;
    }

    return 0;
  });

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

  const {
    register,
    handleSubmit,
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
        setIsSubmiting(true);
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
          <div className="flex gap-10 mt-10">
            <div className="flex flex-col">
              <label htmlFor="startupName" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Nome</span>
              </label>
              <input
                id="startupName"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2"
                {...register("startupName")}
              />
              {errors.startupName?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.startupName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">País</span>
              </label>
              <select
                id="country"
                {...register("country")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">País</option>
                {sortedCountriesData.map(
                  (option: { id: number; label: string }) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors.country?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 mt-5">
            <div className="flex flex-col">
              <label htmlFor="vertical" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Vertical</span>
              </label>
              <select
                id="vertical"
                {...register("vertical")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {sortedVerticalData.map(
                  (option: { id: number; label: string }) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors.vertical?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.vertical.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="stateAndCity" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Cidade/Estado</span>
              </label>
              <input
                id="stateAndCity"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2"
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
            <div className="flex flex-col">
              <label htmlFor="operationalStage" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Estágio de operação</span>
              </label>
              <select
                id="operationalStage"
                {...register("operationalStage")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
                {sortedOperationalStage.map(
                  (option: { id: number; label: string }) => (
                    <option key={option.id} value={Number(option.id)}>
                      {option.label}
                    </option>
                  )
                )}
              </select>
              {errors.operationalStage?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.operationalStage.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="businessModel" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Modelo de negócio</span>
              </label>
              <select
                id="businessModel"
                {...register("businessModel")}
                className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
              >
                <option value="">Selecione uma opção</option>
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
            <div className="flex flex-col">
              <label htmlFor="subscriptionNumber" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">CNPJ</span>
              </label>
              <input
                id="subscriptionNumber"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2"
                {...register("subscriptionNumber")}
              />
              {errors.subscriptionNumber?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.subscriptionNumber.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="foundationDate" className="flex items-center">
                <div>
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">Data fundação</span>
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
            <div className="flex flex-col">
              <label htmlFor="referenceLink" className="flex items-center">
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Site</span>
              </label>
              <input
                id="referenceLink"
                type="text"
                className="border rounded-md w-[300px] h-[40px] pl-2"
                {...register("referenceLink")}
              />
              {errors.referenceLink?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.referenceLink.message}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="loadPitchDeck" className="flex items-center">
                <div className="flex flex-col">
                  <div>
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">Pitchdeck</span>
                  </div>
                </div>
              </label>
              <Controller
                name="loadPitchDeck"
                control={control}
                render={({ field: { ref, name, onBlur, onChange } }) => (
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={ref}
                      name={name}
                      id={name}
                      onBlur={onBlur}
                      accept=".pdf"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        setLocalPitchDeckFile(selectedFile || undefined);
                        onChange(selectedFile);
                      }}
                    />
                    {localPitchDeckFile || pitchDeckFile ? (
                      <div className="relative flex items-center space-x-2 font-medium">
                        <div className="flex items-center justify-between w-[300px]">
                          <span
                            className="text-blue-500 cursor-pointer"
                            title={
                              localPitchDeckFile
                                ? localPitchDeckFile.name
                                : pitchDeckFile || ""
                            }
                            onClick={() =>
                              window.open(
                                localPitchDeckFile
                                  ? URL.createObjectURL(localPitchDeckFile)
                                  : pitchDeckFile,
                                "_blank"
                              )
                            }
                          >
                            {truncateFileName(
                              localPitchDeckFile
                                ? localPitchDeckFile.name
                                : pitchDeckFile || "",
                              30
                            )}
                          </span>
                          <div
                            className="flex absolute right-[-30px] items-center justify-center w-9 h-9 bg-gray-500 rounded-full cursor-pointer"
                            onClick={() =>
                              document.getElementById(name)?.click()
                            }
                          >
                            <FaEdit className="text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span
                        className="text-gray-500 cursor-pointer"
                        onClick={() => document.getElementById(name)?.click()}
                      >
                        Selecionar arquivo
                      </span>
                    )}
                  </div>
                )}
              />
              {errors.loadPitchDeck?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.loadPitchDeck.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-10 ml-10">
          <label htmlFor="loadLogo" className="flex items-center">
            <div className="flex flex-col">
              <div>
                <span className="text-red-500">*</span>
                <span className="text-gray-500">Logo</span>
              </div>
            </div>
          </label>
          <Controller
            name="loadLogo"
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
              <div className="flex items-center space-x-2">
                <div className="relative w-48 h-48 bg-white">
                  <Image
                    src={
                      localLogoFile
                        ? URL.createObjectURL(localLogoFile)
                        : logoFile || selectImagePlaceHolder
                    }
                    alt="logo-image"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
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
                    const selectedFile = e.target.files?.[0];
                    setLocalLogoFile(selectedFile || undefined);
                    onChange(selectedFile);
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
          <span className="text-gray-500">
            Marque todos os desafios que sua startup enfrenta neste momento
          </span>
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
          <span className="text-gray-500">
            Quais são as conexões desejadas da startup no programa?
          </span>
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
          <span className="text-gray-500">
            Fazer conexões apenas no país de origem da minha startup?
          </span>
        </label>
        <select
          id="connectionsOnlyOnStartupCountryOrigin"
          {...register("connectionsOnlyOnStartupCountryOrigin")}
          className="block pl-2 w-[300px] h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs text-xs lg:text-base sm:leading-6"
        >
          <option value="">Selecione uma opção</option>
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
            Proposta de valor (max 200 caracteres)
          </span>
        </label>
        <textarea
          id="valueProposal"
          rows={4}
          className="border rounded-md resize-none h-[70px] w-full pl-2"
          maxLength={200}
          {...register("valueProposal")}
          // onChange={(e) =>
          //   updateFormData({
          //     valueProposal: e.target.value,
          //   })
          // }
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
            <span>Descrição da startup </span>
            <p className="text-xs">
              (Descreva sua startup com o máximo de detalhes possível)
            </p>
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
    </form>
  );
}

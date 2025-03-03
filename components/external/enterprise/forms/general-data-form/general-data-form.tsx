"use client";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnterpriseCategoryType, Language } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import selectImagePlaceHolder from "@/assets/img/select-image-placeholder.png";
import { Button } from "@/components/ui/button";
import { useFormEnterpriseDataState } from "@/contexts/FormEnterpriseContext";
import { EnterpriseSchema } from "@/lib/schemas/schema-enterprise";

import { SelectDataProps } from "../../enteprise-form";
import ImageCropDialog from "../../image-crop-dialog";

import MultiSelect from "./multi-select";

import "react-image-crop/dist/ReactCrop.css";

const MAX_IMAGE_FILE = 1024 * 1024;

interface ValueProps {
  id: number;
  label: string;
}

interface Props {
  data: SelectDataProps;
}

export default function GeneralDataForm({ data }: Props) {
  const t = useTranslations();
  const { data: session } = useSession();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [localLogoFile, setLocalLogoFile] = useState<File | null>(null);

  const { initialData, logoFile, actorId, refetch } =
    useFormEnterpriseDataState();

  const formSchema = EnterpriseSchema(t);

  const countriesData: ValueProps[] = data.country.map((value) => ({
    id: value.id,
    label:
      session?.user?.language === Language.PT_BR
        ? value.name_pt
        : value.name_en,
  }));

  const sortedCountriesData = countriesData
    ?.slice()
    .sort((a, b) => a.label.localeCompare(b.label));

  const activityAreasData = data.enterprise_activity_area.reduce(
    (acc, value) => {
      const category = value.enterprise_activity_area_category;
      const categoryLabel =
        session?.user?.language === Language.PT_BR
          ? category.name_pt
          : category.name_en;

      if (!acc[categoryLabel]) {
        acc[categoryLabel] = [];
      }

      acc[categoryLabel].push({
        id: value.id,
        label:
          session?.user?.language === Language.PT_BR
            ? value.name_pt
            : value.name_en,
      });

      return acc;
    },
    {} as Record<string, { id: number; label: string }[]>
  );

  const activityAreasOptions = Object.entries(activityAreasData).map(
    ([group, options]) => ({
      label: group,
      options: options.sort((a, b) => a.label.localeCompare(b.label)),
    })
  );

  const objectivesData: ValueProps[] = data.enterprise_objectives.map(
    (value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    })
  );

  const sortedObjectives = objectivesData.slice().sort((a, b) => {
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

  const collegeOrganizationTypeData: ValueProps[] =
    data.enterprise_college_organization_type.map((value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    }));

  const sortedCollegeOrganizationType = collegeOrganizationTypeData
    .slice()
    .sort((a, b) => {
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

  const collegeActivityAreaData: ValueProps[] =
    data.enterprise_college_activity_area.map((value) => ({
      ...value,
      label:
        session?.user?.language === Language.PT_BR
          ? value.name_pt
          : value.name_en,
    }));

  const sortedCollegeActivityArea = collegeActivityAreaData
    .slice()
    .sort((a, b) => {
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
    setValue,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      ...initialData,
      logoImage: initialData.logoImageUrl || undefined,
    },
    resolver: zodResolver(formSchema),
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
    setValue("logoImage", file);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const currentValues = getValues();

    const hasNoChanges = compareFormData(currentValues, initialData);

    if (hasNoChanges && !localLogoFile) {
      toast.warning(t("generalData.noChanges"));
      return;
    }

    mutation.mutate(data);
  };

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      if (localLogoFile) {
        formData.append("file-logo", localLogoFile);
      }
      formData.append("data", JSON.stringify(data));

      try {
        setIsSubmitting(true);
        const response = await axios.patch(
          `/api/enterprise-form/general-data/${actorId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          toast.success(t("generalData.saveSuccess"));
          refetch();
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.log("error: ", error);
        toast.error(t("generalData.saveError"));
      }
      setIsSubmitting(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["enterprise-initial-data", actorId],
      });
    },
  });
  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-6 mb-24">
        <div className="w-2/3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-500 uppercase">
              {t("generalData.title")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="flex items-center">
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">{t("generalData.name")}</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("name")}
                />
                {errors.name?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="countryId" className="flex items-center">
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">
                    {t("generalData.countryId")}
                  </span>
                </label>
                <select
                  id="countryId"
                  {...register("countryId")}
                  className="block pl-2 h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                >
                  <option value="">{t("generalData.selectOption")}</option>
                  {sortedCountriesData.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.countryId?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.countryId.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="fullAddress" className="flex items-center">
                  <span className="text-gray-500">
                    {t("generalData.fullAddress")}
                  </span>
                </label>
                <input
                  id="fullAddress"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("fullAddress")}
                />
                {errors.fullAddress?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.fullAddress.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="stateCity" className="flex items-center">
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">
                    {t("generalData.stateCity")}
                  </span>
                </label>
                <input
                  id="stateCity"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("stateCity")}
                />
                {errors.stateCity?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.stateCity.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="subscriptionNumber"
                  className="flex items-center"
                >
                  <span className="text-gray-500">
                    {t("generalData.subscriptionNumber")}
                  </span>
                </label>
                <input
                  id="subscriptionNumber"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("subscriptionNumber")}
                />
                {errors.subscriptionNumber?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.subscriptionNumber.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="website" className="flex items-center">
                  <span className="text-gray-500">
                    {t("generalData.website")}
                  </span>
                </label>
                <input
                  id="website"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("website")}
                />
                {errors.website?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="activityAreas" className="flex items-center">
                  <span className="text-gray-500">
                    {t("generalData.activityAreas")}
                  </span>
                </label>
                <MultiSelect
                  control={control}
                  name="activityAreas"
                  options={activityAreasOptions}
                  placeholder={t("generalData.selectOption")}
                  error={errors.activityAreas}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase">
              {t("generalData.responsibleRepresentative")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="mainResponsibleName"
                  className="flex items-center"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">
                    {t("generalData.mainResponsibleName")}
                  </span>
                </label>
                <input
                  id="mainResponsibleName"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("mainResponsibleName")}
                />
                {errors.mainResponsibleName?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.mainResponsibleName.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="mainResponsiblePhone"
                  className="flex items-center"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">
                    {t("generalData.mainResponsiblePhone")}
                  </span>
                </label>
                <input
                  id="mainResponsiblePhone"
                  type="text"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("mainResponsiblePhone")}
                />
                {errors.mainResponsiblePhone?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.mainResponsiblePhone.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="mainResponsibleEmail"
                  className="flex items-center"
                >
                  <span className="text-red-500">*</span>
                  <span className="text-gray-500">
                    {t("generalData.mainResponsibleEmail")}
                  </span>
                </label>
                <input
                  id="mainResponsibleEmail"
                  type="email"
                  className="border rounded-md h-[40px] pl-2"
                  {...register("mainResponsibleEmail")}
                />
                {errors.mainResponsibleEmail?.message && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.mainResponsibleEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-6">
            <h2 className="text-lg font-semibold text-gray-500 uppercase">
              {t("generalData.otherInformation")}
            </h2>
            {/* company */}
            {session?.user?.enterprise_category_code ===
              EnterpriseCategoryType.TRADITIONAL_COMPANY && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="enterpriseOrganizationType"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.enterpriseOrganizationType")}
                    </span>
                  </label>
                  <input
                    id="enterpriseOrganizationType"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("enterpriseOrganizationType")}
                  />
                  {errors.enterpriseOrganizationType?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.enterpriseOrganizationType.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="enterpriseEmployeesQuantity"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.enterpriseEmployeesQuantity")}
                    </span>
                  </label>
                  <input
                    id="enterpriseEmployeesQuantity"
                    type="number"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("enterpriseEmployeesQuantity")}
                  />
                  {errors.enterpriseEmployeesQuantity?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.enterpriseEmployeesQuantity.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="enterpriseSocialCapital"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.enterpriseSocialCapital")}
                    </span>
                  </label>
                  <input
                    id="enterpriseSocialCapital"
                    type="number"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("enterpriseSocialCapital")}
                  />
                  {errors.enterpriseSocialCapital?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.enterpriseSocialCapital.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="enterpriseMainResponsibleName"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.enterpriseMainResponsibleName")}
                    </span>
                  </label>
                  <input
                    id="enterpriseMainResponsibleName"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("enterpriseMainResponsibleName")}
                  />
                  {errors.enterpriseMainResponsibleName?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.enterpriseMainResponsibleName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col">
                    <label
                      htmlFor="enterpriseProducts"
                      className="flex items-center"
                    >
                      <span className="text-red-500">*</span>
                      <span className="text-gray-500">
                        {t("generalData.enterpriseProducts")}
                      </span>
                    </label>
                    <textarea
                      id="enterpriseProducts"
                      rows={4}
                      className="pl-2 border rounded-md resize-none h-[150px] w-[620px]"
                      {...register("enterpriseProducts")}
                    />
                    {errors.enterpriseProducts?.message && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.enterpriseProducts.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="enterpriseCertifications"
                      className="flex items-center w-[620px] mt-3"
                    >
                      <span className="text-gray-500">
                        {t("generalData.enterpriseCertifications")}
                      </span>
                    </label>
                    <textarea
                      id="enterpriseCertifications"
                      rows={4}
                      className="pl-2 border rounded-md resize-none h-[150px] w-[620px]"
                      {...register("enterpriseCertifications")}
                    />
                    {errors.enterpriseCertifications?.message && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.enterpriseCertifications.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* goverment */}
            {session?.user?.enterprise_category_code ===
              EnterpriseCategoryType.GOVERNMENT && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="governmentOrganizationType"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.governmentOrganizationType")}
                    </span>
                  </label>
                  <input
                    id="governmentOrganizationType"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("governmentOrganizationType")}
                  />
                  {errors.governmentOrganizationType?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.governmentOrganizationType.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="governmentCoverageArea"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.governmentCoverageArea")}
                    </span>
                  </label>
                  <input
                    id="governmentCoverageArea"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("governmentCoverageArea")}
                  />
                  {errors.governmentCoverageArea?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.governmentCoverageArea.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="governmentBusinessHour"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.governmentBusinessHour")}
                    </span>
                  </label>
                  <input
                    id="governmentBusinessHour"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("governmentBusinessHour")}
                  />
                  {errors.governmentBusinessHour?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.governmentBusinessHour.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="governmentMainResponsibleName"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.governmentMainResponsibleName")}
                    </span>
                  </label>
                  <input
                    id="governmentMainResponsibleName"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("governmentMainResponsibleName")}
                  />
                  {errors.governmentMainResponsibleName?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.governmentMainResponsibleName.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* college */}
            {session?.user?.enterprise_category_code ===
              EnterpriseCategoryType.INNOVATION_ENVIRONMENT && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="collegeOrganizationTypeId"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.collegeOrganizationType")}
                    </span>
                  </label>
                  <select
                    id="collegeOrganizationTypeId"
                    {...register("collegeOrganizationTypeId")}
                    className="block pl-2 h-[40px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">{t("generalData.selectOption")}</option>
                    {sortedCollegeOrganizationType.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.collegeOrganizationTypeId?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.collegeOrganizationTypeId.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="collegePublicPrivate"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.collegePublicPrivate")}
                    </span>
                  </label>
                  <input
                    id="collegePublicPrivate"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("collegePublicPrivate")}
                  />
                  {errors.collegePublicPrivate?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.collegePublicPrivate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="collegeEnrolledStudentsQuantity"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.collegeEnrolledStudentsQuantity")}
                    </span>
                  </label>
                  <input
                    id="collegeEnrolledStudentsQuantity"
                    type="number"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("collegeEnrolledStudentsQuantity")}
                  />
                  {errors.collegeEnrolledStudentsQuantity?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.collegeEnrolledStudentsQuantity.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="collegeMainResponsibleName"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.collegeMainResponsibleName")}
                    </span>
                  </label>
                  <input
                    id="collegeMainResponsibleName"
                    type="text"
                    className="border rounded-md h-[40px] pl-2"
                    {...register("collegeMainResponsibleName")}
                  />
                  {errors.collegeMainResponsibleName?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.collegeMainResponsibleName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="collegeActivityArea"
                    className="flex items-center"
                  >
                    <span className="text-gray-500">
                      {t("generalData.collegeActivityArea")}
                    </span>
                  </label>
                  <MultiSelect
                    control={control}
                    name="collegeActivityArea"
                    options={sortedCollegeActivityArea}
                    placeholder={t("generalData.selectOption")}
                    error={errors.collegeActivityArea}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="flex flex-col">
                  <label
                    htmlFor="fullyDescription"
                    className="flex items-center w-[620px] mt-3"
                  >
                    <span className="text-red-500">*</span>
                    <span className="text-gray-500">
                      {t("generalData.fullyDescription")}
                    </span>
                  </label>
                  <textarea
                    id="fullyDescription"
                    rows={4}
                    className="pl-2 border rounded-md resize-none h-[150px] w-[620px]"
                    {...register("fullyDescription")}
                  />
                  {errors.fullyDescription?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.fullyDescription.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-[620px] h-[190px]">
                  <label
                    htmlFor="enterpriseObjectives"
                    className="flex items-center mb-2"
                  >
                    <span className="text-gray-500">
                      {t("generalData.enterpriseObjectives")}
                    </span>
                  </label>
                  <div className="border rounded-lg border-gray-300 bg-transparent flex p-2 justify-between ">
                    <div className="flex flex-col w-[650px]">
                      {sortedObjectives.map((option: any) => (
                        <div key={option.id} className="mb-3 flex items-start">
                          {" "}
                          <input
                            type="checkbox"
                            id={`enterpriseObjectives-${option.id}`}
                            value={option.id}
                            className="appearance-none w-5 h-5 mr-3 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                            {...register("enterpriseObjectives")}
                          />
                          <label
                            htmlFor={`enterpriseObjectives-${option.id}`}
                            className="text-sm text-gray-500 flex-1"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <div className="mt-6">
            <label htmlFor="logoImg" className="flex items-center mb-2">
              <span className="text-red-500">*</span>
              <span className="text-gray-500">{t("generalData.logo")}</span>
            </label>
            <Controller
              name="logoImage"
              control={control}
              rules={{ required: true }}
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
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        if (file.size > MAX_IMAGE_FILE) {
                          setError("logoImage", {
                            type: "manual",
                            message: t("validation.fileTooLarge"),
                          });
                        } else {
                          handleImageSelect(e);
                          onChange(file);
                        }
                      }
                    }}
                  />
                </div>
              )}
            />
            {errors.logoImage && (
              <p className="mt-2 text-sm text-red-400">
                {errors.logoImage.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="px-6 text-white rounded-md"
        >
          {t("generalData.save")}
        </Button>
      </div>

      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="w-[300px] mt-[20%] h-[90px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center p-2 gap-1">
            <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
            <div className="text-xs text-center font-bold text-gray-500">
              {t("generalData.savingData")}
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
    </form>
  );
}

const compareFormData = (current: any, initial: any) => {
  const fieldsToCompare = [
    "name",
    "countryId",
    "stateCity",
    "subscriptionNumber",
    "fullAddress",
    "website",
    "activityAreas",
    "mainResponsibleName",
    "mainResponsibleEmail",
    "mainResponsiblePhone",
    "enterpriseOrganizationType",
    "enterpriseEmployeesQuantity",
    "enterpriseSocialCapital",
    "enterpriseMainResponsibleName",
    "enterpriseProducts",
    "enterpriseCertifications",
    "governmentOrganizationType",
    "governmentCoverageArea",
    "governmentBusinessHour",
    "governmentMainResponsibleName",
    "collegeOrganizationTypeId",
    "collegePublicPrivate",
    "collegeEnrolledStudentsQuantity",
    "collegeMainResponsibleName",
    "collegeActivityAreas",
    "fullyDescription",
    "enterpriseObjectives",
  ];

  const normalizeValue = (value: any) => {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) {
      return [...value].sort().map(String);
    }
    if (typeof value === "number") return String(value);
    return value;
  };

  const normalizeData = (data: any) => {
    const normalized = { ...data };

    if ("collegeActivityArea" in normalized) {
      normalized.collegeActivityAreas = normalized.collegeActivityArea;
      delete normalized.collegeActivityArea;
    }

    if ("enterpriseCollegeActivityArea" in normalized) {
      normalized.enterpriseCollegeActivityAreas =
        normalized.enterpriseCollegeActivityArea;
      delete normalized.enterpriseCollegeActivityArea;
    }

    return normalized;
  };

  const normalizedCurrent = normalizeData(current);
  const normalizedInitial = normalizeData(initial);

  const cleanCurrent = fieldsToCompare.reduce((acc, field) => {
    acc[field] = normalizeValue(normalizedCurrent[field]);
    return acc;
  }, {} as any);

  const cleanInitial = fieldsToCompare.reduce((acc, field) => {
    acc[field] = normalizeValue(normalizedInitial[field]);
    return acc;
  }, {} as any);

  return isEqual(cleanCurrent, cleanInitial);
};

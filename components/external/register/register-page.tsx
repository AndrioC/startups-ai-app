"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import LoadingSpinner from "@/components/loading-spinner";
import SelectLanguage from "@/components/select-language";

import { LogoImage } from "../login/logo-image";

import { RegisterForm } from "./register-form";

export default function RegisterComponent() {
  const { subdomain } = useParams();
  const t = useTranslations("register");
  const locale = useLocale();

  const { data, isLoading, isError } = useLogoOrganization(subdomain as string);
  const {
    data: enterpriseCategory,
    isLoading: isLoadingEnterpriseCategory,
    isError: errorEnterpriseCategory,
  } = useLoadEnterpriseCategory();

  if (isLoading || isLoadingEnterpriseCategory) {
    return <LoadingSpinner />;
  }

  if (isError || errorEnterpriseCategory) {
    return <div>{t("loadingError")}</div>;
  }

  const logoUrl = data?.logoImgUrl || logoPlaceholder.src;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <SelectLanguage />
      <h1 className="text-center text-black font-semibold text-[32px] md:text-[48px]">
        {t("pageTitle")}
      </h1>

      <div className="bg-white shadow-lg rounded-lg w-full max-w-[660px] flex flex-col items-center md:p-8">
        <LogoImage logoUrl={logoUrl} subdomain={subdomain as string} />
        <RegisterForm
          subdomain={subdomain as string}
          enterpriseCategory={enterpriseCategory.enterprise_category}
          locale={locale}
        />
      </div>
    </div>
  );
}

const useLogoOrganization = (slug: string) =>
  useQuery<{ logoImgUrl: string }>({
    queryKey: ["logo-organization", slug],
    queryFn: () =>
      axios.get(`/api/load-settings/${slug}/load-logo`).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

const useLoadEnterpriseCategory = () =>
  useQuery({
    queryKey: ["enterprise-category"],
    queryFn: () =>
      axios
        .get("/api/register-user/load-enterprise-category")
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

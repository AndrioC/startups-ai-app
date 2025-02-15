"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import LoadingSpinner from "@/components/loading-spinner";

import SelectLanguage from "../../select-language";
import { Button } from "../../ui/button";
import { LogoImage } from "../login/logo-image";

export function ConfirmAccount({ subdomain }: { subdomain: string }) {
  const t = useTranslations("verify");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const locale = useLocale();

  const {
    data: logoData,
    isLoading: isLogoLoading,
    isError: isLogoError,
    error: logoError,
  } = useLogoOrganization(subdomain);
  const {
    data: verifyData,
    isLoading: isVerifyLoading,
    isError: isVerifyError,
    error: verifyError,
  } = useVerifyToken(token, locale, subdomain);

  useEffect(() => {
    if (verifyData?.success) {
      toast.success(t("successMessage"), {
        autoClose: 5000,
        position: "top-center",
      });
      setTimeout(() => {
        router.replace("/auth/login");
      }, 5000);
    }
  }, [verifyData, router, t]);

  if (isLogoLoading || isVerifyLoading) return <LoadingSpinner />;

  let errorMessage = t("error.generic");
  if (isVerifyError) {
    const err = verifyError as AxiosError;
    errorMessage = (err.response?.data as any)?.error || t("error.generic");
  } else if (isLogoError) {
    const err = logoError as AxiosError;
    errorMessage = (err.response?.data as any)?.error || t("error.generic");
  }

  if (isLogoError || isVerifyError) {
    return <ErrorMessage message={errorMessage} />;
  }

  const logoUrl = logoData?.logoImgUrl || logoPlaceholder.src;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <SelectLanguage />
      <h1 className="text-center text-black font-semibold text-3xl md:text-5xl">
        {t("title")}
      </h1>
      <div className="bg-white shadow-lg rounded-lg mt-6 w-full max-w-3xl h-auto md:h-[400px] flex flex-col items-center p-6 md:p-10">
        <LogoImage logoUrl={logoUrl} subdomain={subdomain} />
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          {verifyData?.success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {t("success.title")}
              </h2>
              <p className="text-gray-600 text-base">
                {t("success.description")}
              </p>
              <p className="text-sm text-gray-500">{t("success.redirect")}</p>
              <Link href="/auth/login">
                <Button
                  variant="default"
                  className="mt-4 px-8 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  onClick={() => router.push("/auth/login")}
                >
                  {t("success.button")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-red-500 mb-4">
                <XCircle className="mx-auto h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t("error.title")}
              </h2>
              <p className="text-gray-600">{t("error.description")}</p>
              <Link href="/auth/login">
                <Button
                  variant="default"
                  className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {t("error.button")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  const t = useTranslations("verify");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-4">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          {t("error.title")}
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link href="/auth/login">
          <Button
            variant="default"
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {t("error.button")}
          </Button>
        </Link>
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

const useVerifyToken = (
  token: string | null,
  locale: string,
  subdomain: string
) =>
  useQuery({
    queryKey: ["verify-token", token, locale, subdomain],
    queryFn: () =>
      axios
        .get(
          `/api/verify-token?token=${token}&locale=${locale}&subdomain=${subdomain}`
        )
        .then((res) => res.data),
    enabled: !!token,
  });

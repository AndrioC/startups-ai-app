"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import LoadingSpinner from "@/components/loading-spinner";

import { LogoImage } from "../login/logo-image";

import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordComponent() {
  const { subdomain } = useParams();

  const { data, isLoading, isError } = useLogoOrganization(subdomain as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading organization data</div>;
  }

  const logoUrl = data?.logoImgUrl || logoPlaceholder.src;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <h1 className="text-center text-black font-semibold text-[32px] md:text-[48px]">
        Redefinição de senha.
      </h1>

      <div className="bg-white shadow-lg rounded-lg mt-5 w-full max-w-[660px] h-auto md:h-[640px] flex flex-col items-center p-4 md:p-8">
        <LogoImage logoUrl={logoUrl} subdomain={subdomain as string} />
        <ForgotPasswordForm subdomain={subdomain as string} />
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

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import LoadingSpinner from "@/components/loading-spinner";

import { LoginForm } from "./login-form";
import { LogoImage } from "./logo-image";

export function LoginComponent({ subdomain }: { subdomain: string }) {
  const { data, isLoading, isError } = useLogoOrganization(subdomain);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  const logoUrl = data?.logoImgUrl || logoPlaceholder.src;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <h1 className="text-center text-black font-semibold text-[32px] md:text-[48px]">
        Bem-vindo de volta!
      </h1>
      <div className="bg-white shadow-lg rounded-lg mt-5 w-full max-w-[660px] h-auto md:h-[640px] flex flex-col items-center p-4 md:p-8">
        <LogoImage logoUrl={logoUrl} subdomain={subdomain} />
        <LoginForm subdomain={subdomain} />
      </div>
    </div>
  );
}

function ErrorMessage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
      <p className="text-red-500 text-xl">
        Erro ao carregar os dados. Por favor, tente novamente mais tarde.
      </p>
    </div>
  );
}

const useLogoOrganization = (slug: string) =>
  useQuery<{ logoImgUrl: string }>({
    queryKey: ["logo-organization", slug],
    queryFn: () =>
      axios.get(`/api/load-settings/${slug}/load-logo`).then((res) => {
        return res.data;
      }),
    staleTime: 5 * 60 * 1000,
  });

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCog } from "react-icons/fa";
import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  enterprise_category,
  EnterpriseCategoryType,
  UserType,
} from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/lib/schemas/schema-register";

import { RegistrationSuccessModal } from "./email-creation-success-modal";
import TermsOfUseDialog from "./terms";

export function RegisterForm({
  subdomain,
  enterpriseCategory,
  locale,
}: {
  subdomain: string;
  enterpriseCategory: enterprise_category[];
  locale: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const t = useTranslations("register");

  const formSchema = RegisterSchema(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const toastWarning = (erro: string) => {
    toast.warning(`${t("errorMessage")} ${erro}`, {
      autoClose: 5000,
      position: "top-center",
    });
  };

  const handleModalClose = () => {
    setIsVerificationModalOpen(false);
    router.replace("/auth/login");
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const payload: any = { ...data, locale };

      if (
        data.registerUserType === EnterpriseCategoryType.TRADITIONAL_COMPANY ||
        data.registerUserType === EnterpriseCategoryType.GOVERNMENT ||
        data.registerUserType === EnterpriseCategoryType.INNOVATION_ENVIRONMENT
      ) {
        const selectedCategory = enterpriseCategory.find(
          (cat) => cat.code === data.registerUserType
        );
        if (selectedCategory) {
          payload.enterpriseCategory = selectedCategory.id;
          payload.enterpriseCategoryCode = selectedCategory.code;
          payload.registerUserType = UserType.ENTERPRISE;
        }
      }
      const response = await axios.post(
        `/api/register-user/${subdomain}/?token=${token}`,
        JSON.stringify(payload),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setRegisteredEmail(data.registerEmail);
        setIsVerificationModalOpen(true);
        return;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toastWarning(error.response.data.error);
      } else {
        toastWarning(t("unexpectedError"));
      }
    }
    setIsSubmitting(false);
  };

  const userTypeData = [
    { id: "STARTUP", label: t("userTypes.STARTUP") },
    { id: "MENTOR", label: t("userTypes.MENTOR") },
    { id: "INVESTOR", label: t("userTypes.INVESTOR") },
    { id: "TRADITIONAL_COMPANY", label: t("userTypes.TRADITIONAL_COMPANY") },
    { id: "GOVERNMENT", label: t("userTypes.GOVERNMENT") },
    {
      id: "INNOVATION_ENVIRONMENT",
      label: t("userTypes.INNOVATION_ENVIRONMENT"),
    },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const handleAgreeTerms = () => {
    setValue("registerUserTerms", true);
  };

  return (
    <form
      className="space-y-6 flex-1 flex flex-col w-full px-4 md:px-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-[#4087C2] self-start md:ml-[40px] font-medium text-[15px] mb-1">
        {t("formTitle")}
      </p>

      <div className="flex flex-col items-center w-full space-y-6">
        <div className="relative w-full max-w-[526px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <AiOutlineUserAdd className="h-5 w-5 text-gray-400" />
          </span>
          <input
            id="registerName"
            {...register("registerName")}
            type="text"
            placeholder={t("namePlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.registerName?.message && (
            <p className="text-sm text-red-400 mt-1">
              {errors.registerName.message}
            </p>
          )}
        </div>

        <div className="relative w-full max-w-[526px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
          </span>
          <input
            id="registerEmail"
            {...register("registerEmail")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.registerEmail?.message && (
            <p className="text-sm text-red-400 mt-1">
              {errors.registerEmail.message}
            </p>
          )}
        </div>

        <div className="relative w-full max-w-[526px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            id="registerPassword"
            {...register("registerPassword")}
            type="password"
            placeholder={t("passwordPlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.registerPassword?.message && (
            <p className="text-sm text-red-400 mt-1">
              {errors.registerPassword.message}
            </p>
          )}
        </div>

        <div className="relative w-full max-w-[526px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            id="registerConfirmPassword"
            {...register("registerConfirmPassword")}
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.registerConfirmPassword?.message && (
            <p className="text-sm text-red-400 mt-1">
              {errors.registerConfirmPassword.message}
            </p>
          )}
        </div>

        <div className="relative w-full max-w-[526px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <FaUserCog className="h-5 w-5 text-gray-400" />
          </span>
          <select
            id="registerUserType"
            {...register("registerUserType")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          >
            <option value="">{t("userTypePlaceholder")}</option>
            {userTypeData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.registerUserType?.message && (
            <p className="text-sm text-red-400 mt-1">
              {errors.registerUserType.message}
            </p>
          )}
        </div>

        <div className="w-full max-w-[526px] flex flex-row justify-between gap-4">
          <div>
            <div className="flex items-start sm:items-center">
              <div className="flex items-center">
                <input
                  id="registerUserTerms"
                  {...register("registerUserTerms")}
                  type="checkbox"
                  className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                />
                <label
                  htmlFor="registerUserTerms"
                  className="text-[#A0AEC0] font-medium text-[15px] cursor-pointer"
                >
                  {t("termsText")}{" "}
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsDialogOpen(true)}
                className="text-blue-500 hover:underline font-medium text-[15px] ml-1"
              >
                {t("termsLink")}
              </button>
            </div>
            {errors.registerUserTerms?.message && (
              <p className="text-sm text-red-400 mt-1">
                {errors.registerUserTerms.message}
              </p>
            )}
          </div>
          <Link
            href="/auth/login"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            {t("haveAccount")}
          </Link>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end mt-6 w-full max-w-[526px] mx-auto">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="bg-[#4087C2] text-white mb-5 font-bold uppercase text-[20px] rounded-[30px] w-full sm:max-w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
        >
          {t("submit")}
        </Button>
      </div>

      <TermsOfUseDialog
        isOpen={isTermsDialogOpen}
        setIsOpen={setIsTermsDialogOpen}
        onAgree={handleAgreeTerms}
      />
      <RegistrationSuccessModal
        open={isVerificationModalOpen}
        onOpenChange={handleModalClose}
        email={registeredEmail}
      />
    </form>
  );
}

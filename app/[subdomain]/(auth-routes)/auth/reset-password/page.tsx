"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { Button } from "@/components/ui/button";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const t = useTranslations("resetPassword");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const params = useParams();
  const slug = params.subdomain;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          newPassword: z.string().min(6, t("newPasswordMin")),
          confirmPassword: z.string().min(6, t("confirmPasswordMin")),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t("passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error(t("tokenMissing"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/reset-password", {
        token,
        newPassword: data.newPassword,
        slug,
      });
      if (response.data.success) {
        toast.success(t("successMessage"), {
          autoClose: 5000,
          position: "top-center",
        });
        router.push("/auth/login");
      } else {
        toast.error(response.data.error || t("errorMessage"));
      }
    } catch (error) {
      toast.error(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F7FA] p-4">
      <h1 className="text-center text-black font-semibold text-3xl md:text-5xl mb-6">
        {t("title")}
      </h1>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-[600px] p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              {...register("newPassword")}
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              className="w-full h-[50px] pl-4 border border-gray-300 rounded-md"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              className="w-full h-[50px] pl-4 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="blue"
            className="w-full uppercase text-[16px] rounded-md h-[50px] shadow-lg hover:bg-[#266395] transition-colors duration-300"
          >
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import * as z from "zod";

import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/lib/schemas/schema";

import { EmailVerificationModal } from "./email-verification-modal";

export function LoginForm({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  const t = useTranslations("auth");

  const NewLoginSchema = LoginSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof NewLoginSchema>>({
    resolver: zodResolver(NewLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      slug: subdomain,
    },
  });

  const toastSuccess = () => {
    toast.success(t("loginSuccess"), {
      autoClose: 5000,
      position: "top-center",
    });
  };

  const toastError = (error: string) => {
    toast.error(`${t("loginError")}: ${error}`, {
      autoClose: 5000,
      position: "top-center",
    });
  };

  const onSubmit = (values: z.infer<typeof NewLoginSchema>) => {
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.emailNotVerified) {
            setVerificationEmail(values.email);
            setShowVerificationModal(true);
            return;
          }

          if (data?.error) {
            toastError(data.error);
          }

          if (data?.success) {
            reset();
            toastSuccess();
            router.replace(data.redirectPath);
          }
        })
        .catch(() => console.log(t("error")));
    });
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: `https://${subdomain}.startupsai.com.br`,
      subdomain: subdomain,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-[526px]"
      >
        <div className="relative w-full mb-6">
          <span className="absolute left-3 top-4">
            <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
          </span>
          <input
            id="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.email?.message && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="relative w-full mb-1">
          <span className="absolute left-3 top-4">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="password"
            id="password"
            {...register("password")}
            placeholder={t("passwordPlaceholder")}
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          {errors.password?.message && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="w-full flex justify-between mb-6">
          <Link
            href="/auth/register"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            {t("register")}
          </Link>
          <Link
            href="/auth/forgot-password"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <div className="flex justify-center">
          <Button
            variant="blue"
            type="submit"
            className="bg-[#4087C2] text-white font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <FaSpinner className="animate-spin h-5 w-5 mr-2" />
            ) : (
              t("signIn")
            )}
          </Button>
        </div>
      </form>
      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="mt-4 w-full"
      >
        Sign in with Google
      </Button>
      <EmailVerificationModal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        email={verificationEmail}
      />
    </>
  );
}

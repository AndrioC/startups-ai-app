// RegisterForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCog } from "react-icons/fa";
import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/lib/schemas/schema-register";

import TermsOfUseDialog from "./terms";

export function RegisterForm({ subdomain }: { subdomain: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const formSchema = RegisterSchema();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const toastSuccess = () => {
    toast.success("Usuário criado com sucesso!", {
      autoClose: 5000,
      position: "top-center",
    });
  };

  const toastWarning = (erro: string) => {
    toast.warning(`Tivemos um problema ao criar seu e-mail: ${erro}`, {
      autoClose: 5000,
      position: "top-center",
    });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/api/register-user/${subdomain}/?token=${token}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsSubmitting(false);
        toastSuccess();
        router.replace("/auth/login");
        return;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toastWarning(error.response.data.error);
      } else {
        toastWarning("An unexpected error occurred.");
      }
    }
    setIsSubmitting(false);
  };

  const userTypeData = [
    { id: "STARTUP", label: "Startup" },
    { id: "MENTOR", label: "Mentor" },
    { id: "INVESTOR", label: "Investor" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const handleAgreeTerms = () => {
    setValue("registerUserTerms", true);
  };

  return (
    <form
      className="space-y-6 flex-1 flex flex-col w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-[#4087C2] self-start md:ml-[40px] font-medium text-[15px] mb-1">
        Digite seus dados para criar um conta de acesso.
      </p>

      <div className="relative w-full max-w-[526px] mx-auto">
        <span className="absolute left-3 top-4">
          <AiOutlineUserAdd className="h-5 w-5 text-gray-400" />
        </span>
        <input
          id="registerName"
          {...register("registerName")}
          type="text"
          placeholder="Digite seu nome"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.registerName?.message && (
          <p className="text-sm text-red-400">{errors.registerName.message}</p>
        )}
      </div>

      <div className="relative w-full max-w-[526px] mx-auto">
        <span className="absolute left-3 top-4">
          <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
        </span>
        <input
          id="registerEmail"
          {...register("registerEmail")}
          type="email"
          placeholder="Digite seu e-mail"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.registerEmail?.message && (
          <p className="text-sm text-red-400">{errors.registerEmail.message}</p>
        )}
      </div>

      <div className="relative w-full max-w-[526px] mx-auto">
        <span className="absolute left-3 top-4">
          <MdLock className="h-5 w-5 text-gray-400" />
        </span>
        <input
          id="registerPassword"
          {...register("registerPassword")}
          type="password"
          placeholder="Digite sua senha"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.registerPassword?.message && (
          <p className="text-sm text-red-400">
            {errors.registerPassword.message}
          </p>
        )}
      </div>

      <div className="relative w-full max-w-[526px] mx-auto">
        <span className="absolute left-3 top-4">
          <MdLock className="h-5 w-5 text-gray-400" />
        </span>
        <input
          id="registerConfirmPassword"
          {...register("registerConfirmPassword")}
          type="password"
          placeholder="Confirmar senha"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.registerConfirmPassword?.message && (
          <p className="text-sm text-red-400">
            {errors.registerConfirmPassword.message}
          </p>
        )}
      </div>

      <div className="relative w-full max-w-[526px] mx-auto">
        <span className="absolute left-3 top-4">
          <FaUserCog className="h-5 w-5 text-gray-400" />
        </span>
        <select
          id="registerUserType"
          {...register("registerUserType")}
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        >
          <option value="">Selecione uma opção</option>
          {userTypeData.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.registerUserType?.message && (
          <p className="text-sm text-red-400">
            {errors.registerUserType.message}
          </p>
        )}
      </div>

      <div className="w-full max-w-[526px] flex justify-between mx-auto">
        <div>
          <label className="flex items-center">
            <input
              id="registerUserTerms"
              {...register("registerUserTerms")}
              type="checkbox"
              className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
            />
            <span className="text-[#A0AEC0] font-medium text-[15px]">
              Eu aceito os{" "}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsTermsDialogOpen(true);
                }}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                termos de uso
              </span>
            </span>
          </label>
          {errors.registerUserTerms?.message && (
            <p className="text-sm text-red-400">
              {errors.registerUserTerms.message}
            </p>
          )}
        </div>
        <Link
          href="/auth/login"
          className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
        >
          Já possuo conta
        </Link>
      </div>

      <div className="flex justify-end mt-auto w-full max-w-[526px] mx-auto">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="bg-[#4087C2] text-white mb-5 font-bold uppercase text-[20px] rounded-[30px] w-full max-w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
        >
          Cadastrar
        </Button>
      </div>
      <TermsOfUseDialog
        isOpen={isTermsDialogOpen}
        setIsOpen={setIsTermsDialogOpen}
        onAgree={handleAgreeTerms}
      />
    </form>
  );
}

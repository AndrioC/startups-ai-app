"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { z } from "zod";

import { Button } from "@/components/ui/button";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ subdomain }: { subdomain: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `/api/forgot-password/${subdomain}`,
        data
      );
      if (response.status === 200) {
        toast.success(
          "Instruções de recuperação de senha enviadas para seu email."
        );
      }
    } catch (error) {
      toast.error("Erro ao enviar o email de recuperação de senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[526px]">
      <p className="text-[#4087C2] w-full max-w-[500px] self-start font-medium text-[15px] mb-1 mt-10">
        Digite seu email de login que enviaremos as instruções para você
        redefinir sua senha.
      </p>

      <div className="relative w-full mb-6">
        <span className="absolute left-3 top-4">
          <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
        </span>
        <input
          {...register("email")}
          type="email"
          placeholder="Digite seu e-mail"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="w-full flex justify-between mb-6">
        <Link href="/auth/login">
          <Button className="border-[#4087C2] bg-transparent border-2 md:border-4 text-[#4087C2] font-bold uppercase text-[16px] md:text-[20px] rounded-[30px] w-full max-w-[120px] h-[50px] shadow-xl hover:bg-transparent hover:text-[#266395] transition-colors duration-300 ease-in-out">
            Voltar
          </Button>
        </Link>
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="bg-[#4087C2] text-white font-bold uppercase text-[16px] md:text-[20px] rounded-[30px] w-full max-w-[120px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
        >
          Enviar
        </Button>
      </div>
    </form>
  );
}

// RenewPasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdLock } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";

import checkImg from "@/assets/img/check-img.svg";
import { Button } from "@/components/ui/button";

const renewPasswordSchema = z
  .object({
    code: z.string().min(1, "Código é obrigatório"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RenewPasswordFormData = z.infer<typeof renewPasswordSchema>;

interface RenewPasswordFormProps {
  subdomain: string;
  email?: string | null;
}

export function RenewPasswordForm({
  subdomain,
  email,
}: RenewPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RenewPasswordFormData>({
    resolver: zodResolver(renewPasswordSchema),
  });

  const onSubmit = async (data: RenewPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/renew-password/${subdomain}`, {
        ...data,
        email,
      });
      if (response.status === 200) {
        toast.success("Senha redefinida com sucesso!");
        router.push("/auth/login");
      }
    } catch (error) {
      toast.error("Erro ao redefinir a senha. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[520px]">
      <div className="bg-[#F2FFF0] w-full h-auto md:h-[84px] flex items-center p-4 rounded-md gap-3 mb-10">
        <Image
          src={checkImg}
          alt="check-img"
          width={25}
          height={25}
          className="h-auto w-auto"
        />
        <p className="text-[15px] text-[#4A5568] font-medium">
          Um email foi enviado para{" "}
          <span className="font-bold italic">{email}</span> com um código para
          redefinir sua senha
        </p>
      </div>

      <p className="text-[#4087C2] font-medium text-[15px] mb-6">
        Por favor, insira no campo abaixo o código de ativação que você recebeu
        por email e redefina uma nova senha.
      </p>

      <div className="relative w-full mb-6">
        <span className="absolute left-3 top-4">
          <PiPasswordFill className="h-5 w-5 text-gray-400" />
        </span>
        <input
          {...register("code")}
          type="text"
          placeholder="Digite o código enviado por email"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.code && (
          <p className="text-sm text-red-400">{errors.code.message}</p>
        )}
      </div>

      <div className="relative w-full mb-6">
        <span className="absolute left-3 top-4">
          <MdLock className="h-5 w-5 text-gray-400" />
        </span>
        <input
          {...register("password")}
          type="password"
          placeholder="Digite uma nova senha"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <div className="relative w-full mb-6">
        <span className="absolute left-3 top-4">
          <MdLock className="h-5 w-5 text-gray-400" />
        </span>
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Repita a sua senha"
          className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          type="submit"
          variant="blue"
          disabled={isSubmitting}
          className="bg-[#4087C2] text-white mt-6 mb-6 md:mb-20 font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
        >
          Redefinir
        </Button>
      </div>
    </form>
  );
}

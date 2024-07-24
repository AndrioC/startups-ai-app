"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserCog } from "react-icons/fa";
import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { z } from "zod";

import sriLogo from "@/assets/img/logos/sri-logo.svg";
import { Button } from "@/components/ui/button";
import { RegisterSchema } from "@/lib/schemas/schema-register";

export default function RegisterComponent() {
  const formSchema = RegisterSchema();
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { subdomain } = useParams();

  const {
    register,
    handleSubmit,
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
      setIsSubmiting(true);
      const response = await axios.post(
        `/api/register-user/${subdomain}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsSubmiting(false);
        toastSuccess();
        return;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("axios error: ", error.response.data.error);
        toastWarning(error.response.data.error);
      } else {
        toastWarning("An unexpected error occurred.");
      }
    }
    setIsSubmiting(false);
  };

  const userTypeData = [
    {
      id: "STARTUP",
      label: "Startup",
    },
    {
      id: "MENTOR",
      label: "Mentor",
    },
    {
      id: "INVESTOR",
      label: "Investor",
    },
  ];

  const sortedUserTypeData = userTypeData.slice().sort((a, b) => {
    const labelA = a.label.toUpperCase();
    const labelB = b.label.toUpperCase();

    if (labelA < labelB) {
      return -1;
    }

    if (labelA > labelB) {
      return 1;
    }

    return 0;
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA]">
      <h1 className="text-center text-black font-semibold text-[48px]">
        Crie sua conta agora mesmo!
      </h1>

      <div className="bg-white shadow-lg rounded-lg mt-5 w-[660px] flex flex-col items-center">
        <Image
          src={sriLogo}
          alt="sri-logo"
          width={250}
          height={250}
          className="mt-[40px] mb-[20px]"
        />

        <p className="text-[#4087C2] self-start ml-[70px] font-medium text-[15px] mb-1">
          Digite seus dados para criar um conta de acesso.
        </p>

        <form
          className="space-y-6 flex-1 flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative w-[526px]">
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
              <p className="text-sm text-red-400">
                {errors.registerName.message}
              </p>
            )}
          </div>

          <div className="relative w-[526px]">
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
              <p className="text-sm text-red-400">
                {errors.registerEmail.message}
              </p>
            )}
          </div>

          <div className="relative w-[526px]">
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

          <div className="relative w-[526px]">
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

          <div className="relative w-[526px]">
            <span className="absolute left-3 top-4">
              <FaUserCog className="h-5 w-5 text-gray-400" />
            </span>
            <select
              id="registerUserType"
              {...register("registerUserType")}
              className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
            >
              <option value="">Selecione uma opção</option>
              {sortedUserTypeData.map((option: any) => (
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

          <div className="w-[526px] flex justify-between">
            <div>
              <label className="flex items-center">
                <input
                  id="registerUserTerms"
                  {...register("registerUserTerms")}
                  type="checkbox"
                  className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
                />
                <span className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out">
                  <Link href={"/terms"}>Termos de uso</Link>
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
              Já possuo conto
            </Link>
          </div>

          <div className="flex justify-end mt-auto">
            <Button
              type="submit"
              variant="blue"
              disabled={isSubmiting}
              className="bg-[#4087C2] text-white mb-10 font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
            >
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

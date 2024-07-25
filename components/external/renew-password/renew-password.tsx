"use client";

import { MdLock } from "react-icons/md";
import { PiPasswordFill } from "react-icons/pi";
import Image from "next/image";

import checkImg from "@/assets/img/check-img.svg";
import sriLogo from "@/assets/img/logos/sri-logo.svg";
import { Button } from "@/components/ui/button";

const email = "rmgrossi@gmail.com";

export default function RenewPasswordComponent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <h1 className="text-center text-black font-semibold text-[32px] md:text-[48px]">
        Redefinição de senha.
      </h1>

      <div className="bg-white shadow-lg rounded-lg mt-10 w-full max-w-[660px] h-auto md:h-[640px] flex flex-col items-center p-4 md:p-0">
        <Image
          src={sriLogo}
          alt="sri-logo"
          width={250}
          height={250}
          className="mt-[20px] md:mt-[40px] mb-[20px]"
        />

        <div className="bg-[#F2FFF0] w-full max-w-[520px] h-auto md:h-[84px] flex items-center p-4 rounded-md gap-3">
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

        <p className="text-[#4087C2] w-full max-w-[520px] self-start md:ml-[70px] font-medium text-[15px] mb-1 mt-10">
          Por favor, insira no campo abaixo o código de ativação que você
          recebeu por email e redefina uma nova senha.
        </p>

        <div className="relative w-full max-w-[526px] mb-6">
          <span className="absolute left-3 top-4">
            <PiPasswordFill className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Digite o código enviado por email"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <div className="relative w-full max-w-[526px] mb-6">
          <span className="absolute left-3 top-4">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="password"
            placeholder="Digite uma nova senha"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <div className="relative w-full max-w-[526px] mb-1">
          <span className="absolute left-3 top-4">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="password"
            placeholder="Repita a sua senha"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <Button
          variant="blue"
          className="bg-[#4087C2] text-white mt-6 mb-6 md:mb-20 font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out self-center md:self-end md:mr-16"
        >
          Redefinir
        </Button>
      </div>
    </div>
  );
}

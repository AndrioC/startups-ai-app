import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

import sriLogo from "@/assets/img/logos/sri-logo.svg";
import { Button } from "@/components/ui/button";

export default function LoginComponent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA]">
      <h1 className="text-center text-black font-semibold text-[48px]">
        Bem-vindo de volta!
      </h1>

      <div className="bg-white shadow-lg rounded-lg mt-10 w-[660px] h-[640px] flex flex-col items-center">
        <Image
          src={sriLogo}
          alt="sri-logo"
          width={250}
          height={250}
          className="mt-[40px] mb-[20px]"
        />

        <p className="text-[#4087C2] self-start ml-[70px] font-medium text-[15px] mb-1 mt-10">
          Digite seu usuário e senha para acessar o sistema.
        </p>

        <div className="relative w-[526px] mb-6">
          <span className="absolute left-3 top-4">
            <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <div className="relative w-[526px] mb-1">
          <span className="absolute left-3 top-4">
            <MdLock className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <div className="w-[526px] flex justify-between mb-6">
          <Link
            href="/auth/register"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            Cadastrar
          </Link>
          <Link
            href="/auth/forgot-password"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button
          variant="blue"
          className="bg-[#4087C2] text-white font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}

import { AiOutlineUserAdd } from "react-icons/ai";
import { MdLock, MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

import sriLogo from "@/assets/img/logos/sri-logo.svg";
import { Button } from "@/components/ui/button";

export default function RegisterComponent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA]">
      <h1 className="text-center text-black font-semibold text-[48px]">
        Crie sua conta agora mesmo!
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
          Digite seus dados para criar um conta de acesso.
        </p>

        <div className="relative w-[526px] mb-6">
          <span className="absolute left-3 top-4">
            <AiOutlineUserAdd className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Digite seu nome"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

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
          <label className="flex items-center">
            <input
              type="checkbox"
              className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
            />
            <span className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out">
              <Link href={"/terms"}>Termos de uso</Link>
            </span>
          </label>
          <Link
            href="/login"
            className="text-[#A0AEC0] font-medium text-[15px] hover:text-[#7b8a9d] transition-colors duration-300 ease-in-out"
          >
            Já possuo conto
          </Link>
        </div>

        <Button
          variant="blue"
          className="bg-[#4087C2] text-white mb-20 mr-16 font-bold uppercase text-[20px] rounded-[30px] w-[175px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out mt-auto self-end"
        >
          Cadastrar
        </Button>
      </div>
    </div>
  );
}

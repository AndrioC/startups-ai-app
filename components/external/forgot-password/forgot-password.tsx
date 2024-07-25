import { MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

import sriLogo from "@/assets/img/logos/sri-logo.svg";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordComponent() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA] p-4">
      <h1 className="text-center text-black font-semibold text-[32px] md:text-[48px] mt-10">
        Redefinição de senha.
      </h1>

      <div className="bg-white shadow-lg rounded-lg mt-10 w-full max-w-[660px] h-auto md:h-[640px] flex flex-col items-center p-4 md:p-8">
        <Image
          src={sriLogo}
          alt="sri-logo"
          width={250}
          height={250}
          className="mt-[20px] md:mt-[40px] mb-[20px]"
        />

        <p className="text-[#4087C2] w-full max-w-[500px] self-start md:ml-[40px] font-medium text-[15px] mb-1 mt-10">
          Digite seu email de login que enviaremos as instruções para você
          redefinir sua senha.
        </p>

        <div className="relative w-full max-w-[526px] mb-6">
          <span className="absolute left-3 top-4">
            <MdOutlineMailOutline className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
        </div>

        <div className="w-full max-w-[526px] flex justify-between mb-6">
          <Link href={"/auth/login"}>
            <Button className="border-[#4087C2] bg-transparent border-2 md:border-4 text-[#4087C2] font-bold uppercase text-[16px] md:text-[20px] rounded-[30px] w-full max-w-[120px] h-[50px] shadow-xl hover:bg-transparent hover:text-[#266395] transition-colors duration-300 ease-in-out">
              Voltar
            </Button>
          </Link>
          <Link href={"/auth/login"}>
            <Button
              variant="blue"
              className="bg-[#4087C2] text-white font-bold uppercase text-[16px] md:text-[20px] rounded-[30px] w-full max-w-[120px] h-[50px] shadow-xl hover:bg-[#266395] hover:text-white transition-colors duration-300 ease-in-out"
            >
              Enviar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

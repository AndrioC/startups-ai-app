"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import error404Image from "@/assets/img/error-404.png";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center text-center">
        <Image
          src={error404Image}
          alt="404 Image"
          width={400}
          height={400}
          className="w-full max-w-[400px] h-auto"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-gray-600 mt-4">
          Página não encontrada
        </h1>
        <p className="text-base md:text-lg text-gray-600 mt-2">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button
          className="mt-4 md:mt-2 bg-blue-500 text-white hover:bg-[#1f6dae] px-4 py-2 rounded-md transition-colors duration-300 ease-in-out"
          onClick={handleGoHome}
        >
          Voltar para home
        </Button>
      </div>
    </div>
  );
}

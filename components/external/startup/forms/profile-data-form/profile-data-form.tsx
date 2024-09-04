"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";

import ProfileListModal from "./profile-list-modal";
import StartupProfileMarkDown from "./startup-profile-markdown";

export default function ProfileDataForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { initialData } = useFormStartupDataState();

  const handleUpdateProfileClick = () => {
    toast.info(
      "Esta opção ainda não está disponível! Em breve você poderá usá-la!"
    );
  };

  if (!initialData.startupProfile) {
    return (
      <div className="bg-gray-100 font-sans p-4">
        <div className="bg-gray-300 p-4 rounded-md shadow-sm">
          <p className="text-left text-gray-500">
            O perfil da startup ainda não foi gerado. Por favor, certifique-se
            de que seu cadastro tenha pelo menos 60% de completude e aguarde 24
            horas para que o perfil seja gerado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col text-gray-500 gap-5">
          <h1 className="text-2xl font-semibold">
            PERFIL DA STARTUP GERADO PELA I.A.
          </h1>
          <span className="text-xl font-semibold mr-2">NOTA: 7,8</span>
          <p className="text-sm text-gray-500 font-normal">
            Mantenha o Perfil de sua Startup sempre atualizado para melhorar a
            nota e para facilitar a busca por investidores.
          </p>
        </div>
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={handleUpdateProfileClick}
          >
            <Sparkles size={20} />
            ATUALIZAR PERFIL
          </Button>
          <Button
            variant="link"
            className="text-blue-500 hover:text-blue-700 text-xs"
            onClick={() => setIsModalOpen(true)}
            disabled
          >
            VER PERFIS GERADOS
          </Button>
        </div>
      </div>

      <StartupProfileMarkDown profileData={initialData.startupProfile} />

      <ProfileListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

"use client";

import React from "react";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import StartupProfileMarkDownTab from "./startup-profile-markdown-tab";

export default function ProfileDataTab() {
  const { initialData } = useFormStartupTabDataState();

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
      </div>

      <StartupProfileMarkDownTab profileData={initialData.startupProfile} />
    </div>
  );
}

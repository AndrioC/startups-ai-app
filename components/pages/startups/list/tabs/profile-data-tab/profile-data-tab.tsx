"use client";

import React from "react";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import StartupProfileMarkDownTab from "./startup-profile-markdown-tab";

export default function ProfileDataTab() {
  const { initialData } = useFormStartupTabDataState();

  if (!initialData.startupProfile) {
    return (
      <div className="bg-gray-100 font-sans p-4">
        <div className="bg-gray-300 p-4 rounded-md shadow-sm">
          <p className="text-left text-gray-500">
            O perfil da startup ainda não foi gerado. Por favor, complete as
            informações necessárias para gerar o perfil.
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
        </div>
      </div>

      <StartupProfileMarkDownTab profileData={initialData.startupProfile} />
    </div>
  );
}

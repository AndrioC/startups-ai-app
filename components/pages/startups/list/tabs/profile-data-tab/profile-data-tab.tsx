"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { useFormStartupTabDataState } from "@/contexts/FormStartupTabContext";

import StartupProfileMarkDownTab from "./startup-profile-markdown-tab";

export default function ProfileDataTab() {
  const { initialData } = useFormStartupTabDataState();
  const t = useTranslations("admin.startups.profileDataTab");

  if (!initialData.startupProfile) {
    return (
      <div className="bg-gray-100 font-sans p-4">
        <div className="bg-gray-300 p-4 rounded-md shadow-sm">
          <p className="text-left text-gray-500">{t("profileNotGenerated")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col text-gray-500 gap-5">
          <h1 className="text-2xl font-semibold">{t("profileTitle")}</h1>
        </div>
      </div>

      <StartupProfileMarkDownTab profileData={initialData.startupProfile} />
    </div>
  );
}

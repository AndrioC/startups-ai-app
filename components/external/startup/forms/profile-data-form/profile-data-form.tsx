import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";

import ProfileListModal from "./profile-list-modal";
import StartupProfileMarkDown from "./startup-profile-markdown";

const GENERATE_PROFILE_LAMBDA_URL = `${process.env.NEXT_PUBLIC_GENERATE_PROFILE_LAMBDA_URL}/generate-profile`;

export default function ProfileDataForm() {
  const t = useTranslations("startupForm.profileDataForm");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const { initialData, refetch } = useFormStartupDataState();

  const handleUpdateProfileClick = async () => {
    setIsLoading(true);
    setIsAIModalOpen(true);
    try {
      const response = await axios.post(
        GENERATE_PROFILE_LAMBDA_URL,
        {
          params: {
            startup_id: initialData.startupId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(t("updateProfileFunction.successMessage"));
        refetch();
      } else {
        throw new Error(t("updateProfileFunction.errorMessage"));
      }
    } catch (error) {
      console.error(t("updateProfileFunction.errorMessage"), error);
      toast.error(t("updateProfileFunction.errorMessage"));
    } finally {
      setIsLoading(false);
      setIsAIModalOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col text-gray-500 gap-5">
          <h1 className="text-2xl font-semibold uppercase">
            {t("aiGeneratedStartupProfileTitle")}
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            {t("profileUpdateInstructions")}
          </p>
        </div>
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 uppercase"
            onClick={handleUpdateProfileClick}
            disabled={isLoading}
          >
            <Sparkles size={20} />
            {t("updateProfileButton.label")}
          </Button>
          {initialData.startupProfile && (
            <Button
              variant="link"
              className="text-blue-500 hover:text-blue-700 text-xs uppercase"
              onClick={() => setIsModalOpen(true)}
            >
              {t("viewGeneratedProfilesButton.label")}
            </Button>
          )}
        </div>
      </div>

      {!initialData.startupProfile ? (
        <div className="bg-gray-300 p-4 rounded-md shadow-sm">
          <p className="text-left text-gray-500">
            {t("noProfileGenerated.message")}
          </p>
        </div>
      ) : (
        <StartupProfileMarkDown profileData={initialData.startupProfile} />
      )}

      <ProfileListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("updateProfileButton.loading")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
            <p className="text-center text-gray-600">
              {t("aiAnalysisMessage")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

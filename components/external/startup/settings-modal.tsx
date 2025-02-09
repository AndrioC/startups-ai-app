"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRefreshAuth } from "@/hooks/useRefreshAuth";

import "react-toastify/dist/ReactToastify.css";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getLocaleFromLanguage = (language: string | undefined): string => {
  switch (language) {
    case "PT_BR":
      return "pt-br";
    case "EN":
      return "en";
    default:
      return "pt-br";
  }
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter();
  const t = useTranslations("headerSettings");
  const { refreshAuthData } = useRefreshAuth();
  const { data: session } = useSession();

  const currentLocale = getLocaleFromLanguage(session?.user?.language);
  const [language, setLanguage] = useState<string>(currentLocale);
  const [initialLanguage, setInitialLanguage] = useState<string>(currentLocale);
  const [isSaving, setIsSaving] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(
        `/api/startup/settings/${session?.user?.id}/save-settings`,
        {
          language,
        }
      );
      setInitialLanguage(language);
      toast.success(t("updateSuccess"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      onClose();
      await refreshAuthData();
      router.refresh();
    } catch (error) {
      console.error(t("updateError"), error);
      toast.error(t("updateError"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLanguage(initialLanguage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {t("languageSetting.label")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center space-x-4">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="language" className="text-right font-medium">
              {t("languageSetting.label")}
            </Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  {t("languageSetting.englishLanguage")}
                </SelectItem>
                <SelectItem value="pt-br">
                  {t("languageSetting.portugueseLanguage")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            {t("cancelButton")}
          </Button>
          <Button variant="blue" onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("saving") : t("saveChanges")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

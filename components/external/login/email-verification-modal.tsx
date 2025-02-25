"use client";
import { FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function EmailVerificationModal({
  open,
  onOpenChange,
  email,
}: EmailVerificationModalProps) {
  const t = useTranslations("auth.resendEmail");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-xl rounded-2xl overflow-hidden p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-8 pb-16 relative">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg border-4 border-white">
            <FaEnvelope className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <DialogHeader className="pt-14 px-6 text-center">
          <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
            {t("emailVerificationNeeded")}
          </DialogTitle>
          <p className="mt-3 text-gray-600">
            {t("emailVerificationSentPrefix")}{" "}
            <span className="font-semibold text-blue-600 break-all">
              {email}
            </span>
          </p>
        </DialogHeader>

        <div className="mx-6 my-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-2.5 mt-0.5 flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                {t("checkInbox")}
              </p>
              <p className="text-sm text-blue-600 mt-3 opacity-90">
                {t("checkSpam")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-8 pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 text-lg rounded-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {t("gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

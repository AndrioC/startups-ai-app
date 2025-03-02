"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RegistrationSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function RegistrationSuccessModal({
  open,
  onOpenChange,
  email,
}: RegistrationSuccessModalProps) {
  const t = useTranslations("auth.resendEmail");
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  useEffect(() => {
    if (open && !confettiTriggered) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      setConfettiTriggered(true);
    }
  }, [open, confettiTriggered]);

  useEffect(() => {
    if (!open) {
      setConfettiTriggered(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
        sm:max-w-md 
        max-w-[95%] 
        w-full 
        border-0 
        shadow-xl 
        rounded-2xl 
        overflow-hidden 
        p-0 
        mx-auto 
        my-auto
      "
      >
        <div
          className="
          bg-gradient-to-r 
          from-green-600 
          to-emerald-400 
          p-6 
          md:p-8 
          pb-16 
          relative
        "
        >
          <div
            className="
            absolute 
            -bottom-10 
            left-1/2 
            transform 
            -translate-x-1/2 
            bg-white 
            rounded-full 
            p-3 
            md:p-4 
            shadow-lg 
            border-4 
            border-white
          "
          >
            <FaCheckCircle
              className="
              h-8 
              w-8 
              md:h-10 
              md:w-10 
              text-green-500
            "
            />
          </div>
        </div>

        <DialogHeader
          className="
          pt-14 
          px-4 
          md:px-6 
          text-center
        "
        >
          <DialogTitle
            className="
            text-xl 
            md:text-2xl 
            font-bold 
            text-gray-800 
            tracking-tight
          "
          >
            {t("registrationSuccess")}
          </DialogTitle>
          <p
            className="
            mt-2 
            md:mt-3 
            text-sm 
            md:text-base 
            text-gray-600
          "
          >
            {t("confirmationEmailSent")}{" "}
            <span
              className="
              font-semibold 
              text-green-600 
              break-all 
              text-xs 
              md:text-sm
            "
            >
              {email}
            </span>
          </p>
        </DialogHeader>

        <div
          className="
          mx-4 
          md:mx-6 
          my-4 
          md:my-6 
          bg-green-50 
          border 
          border-green-100 
          rounded-xl 
          p-4 
          md:p-5
        "
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div
              className="
              bg-green-100 
              rounded-full 
              p-2 
              md:p-2.5 
              mt-0.5 
              flex-shrink-0
            "
            >
              <FaCheckCircle
                className="
                h-4 
                w-4 
                md:h-5 
                md:w-5 
                text-green-600
              "
              />
            </div>
            <div>
              <p
                className="
                text-xs 
                md:text-sm 
                font-medium 
                text-green-800
              "
              >
                {t("checkInbox")}
              </p>
              <p
                className="
                text-xs 
                md:text-sm 
                text-green-600 
                mt-1 
                md:mt-3 
                opacity-90
              "
              >
                {t("confirmationRequired")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter
          className="
          px-4 
          md:px-6 
          pb-6 
          md:pb-8 
          pt-2
        "
        >
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="
              w-full 
              bg-gradient-to-r 
              from-green-600 
              to-green-500 
              hover:from-green-700 
              hover:to-green-600 
              text-white 
              font-medium 
              py-2 
              md:py-3 
              text-base 
              md:text-lg 
              rounded-xl 
              transition-all 
              duration-500 
              ease-in-out 
              transform 
              hover:scale-[1.02] 
              shadow-md 
              hover:shadow-lg 
              active:scale-[0.98]
            "
          >
            {t("gotIt")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

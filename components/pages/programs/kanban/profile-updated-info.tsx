"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface ProfileUpdatedInfoProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedStartup: { id: number; name: string } | null;
  refetch: () => void;
}

export default function ProfileUpdatedInfo({
  isOpen,
  setIsOpen,
  selectedStartup,
  refetch,
}: ProfileUpdatedInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations(
    "admin.programs.programStartupTab.profileUpdatedInfo"
  );

  const handleUpdateConfirmation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `/api/kanban/${Number(session?.user?.organization_id)}/update-start-seen-updated?startupId=${selectedStartup?.id}`
      );

      if (response.status === 201) {
        setIsOpen(false);
        setIsLoading(false);
        refetch();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error confirming startup update:", error);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 animate-fadeIn" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Content className="w-[450px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-contentShow">
              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                {t("title")}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {t("message.part1")} <strong>{selectedStartup?.name}</strong>{" "}
                  {t("message.part3")}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="blue"
                  className="w-[100px] bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  onClick={() => handleUpdateConfirmation()}
                  disabled={isLoading}
                >
                  {t("confirmButton")}
                </Button>
              </div>
              <Dialog.Close asChild>
                <button
                  className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
                  aria-label={t("closeButton")}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

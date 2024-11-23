"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAgree: () => void;
}

export default function TermsOfUseDialog({
  isOpen,
  setIsOpen,
  onAgree,
}: Props) {
  const [canAgree, setCanAgree] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("terms");

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setCanAgree(true);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[60vw] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg focus:outline-none">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800">
              {t("title")}
            </Dialog.Title>
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="mt-4 max-h-[60vh] overflow-y-auto pr-4 text-gray-700"
            >
              {/* Object Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.object.title")}
              </h2>
              <p className="mb-4">{t("sections.object.content")}</p>

              {/* Acceptance Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.acceptance.title")}
              </h2>
              <p className="mb-4">{t("sections.acceptance.content")}</p>

              {/* User Access Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.userAccess.title")}
              </h2>
              <p className="mb-4">{t("sections.userAccess.content")}</p>

              {/* Registration Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.registration.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.registration.requirements.title")}
              </h3>
              <p className="mb-2">
                {t("sections.registration.requirements.content")}
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.registration.process.title")}
              </h3>
              <p className="mb-4">
                {t("sections.registration.process.content")}
              </p>

              {/* Services Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.services.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.services.description.title")}
              </h3>
              <p className="mb-2">
                {t("sections.services.description.content")}
              </p>
              <ul className="list-disc pl-5 mb-2">
                {t
                  .raw("sections.services.description.list")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.services.usage.title")}
              </h3>
              <p className="mb-4">{t("sections.services.usage.content")}</p>

              {/* Prices Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.prices.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.prices.policy.title")}
              </h3>
              <p className="mb-2">{t("sections.prices.policy.content")}</p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.prices.payment.title")}
              </h3>
              <p className="mb-2">{t("sections.prices.payment.content")}</p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.prices.renewal.title")}
              </h3>
              <p className="mb-4">{t("sections.prices.renewal.content")}</p>

              {/* Cancellation Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.cancellation.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.cancellation.policy.title")}
              </h3>
              <p className="mb-2">
                {t("sections.cancellation.policy.content")}
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.cancellation.reasons.title")}
              </h3>
              <p className="mb-2">
                {t("sections.cancellation.reasons.content")}
              </p>
              <ul className="list-disc pl-5 mb-4">
                {t
                  .raw("sections.cancellation.reasons.list")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>

              {/* Support Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.support.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.support.contact.title")}
              </h3>
              <p className="mb-2">{t("sections.support.contact.content")}</p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.support.hours.title")}
              </h3>
              <p className="mb-4">{t("sections.support.hours.content")}</p>

              {/* Responsibilities Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.responsibilities.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.responsibilities.user.title")}
              </h3>
              <p className="mb-2">
                {t("sections.responsibilities.user.content")}
              </p>
              <ul className="list-disc pl-5 mb-2">
                {t
                  .raw("sections.responsibilities.user.list")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.responsibilities.platform.title")}
              </h3>
              <p className="mb-2">
                {t("sections.responsibilities.platform.content")}
              </p>
              <ul className="list-disc pl-5 mb-4">
                {t
                  .raw("sections.responsibilities.platform.list")
                  .map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>

              {/* Copyright Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.copyright.title")}
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.copyright.intellectual.title")}
              </h3>
              <p className="mb-2">
                {t("sections.copyright.intellectual.content")}
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                {t("sections.copyright.license.title")}
              </h3>
              <p className="mb-4">{t("sections.copyright.license.content")}</p>

              {/* Sanctions Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.sanctions.title")}
              </h2>
              <p className="mb-4">{t("sections.sanctions.content")}</p>

              {/* Termination Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.termination.title")}
              </h2>
              <p className="mb-4">{t("sections.termination.content")}</p>

              {/* Changes Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.changes.title")}
              </h2>
              <p className="mb-4">{t("sections.changes.content")}</p>

              {/* Privacy Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.privacy.title")}
              </h2>
              <p className="mb-4">{t("sections.privacy.content")}</p>

              {/* Jurisdiction Section */}
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                {t("sections.jurisdiction.title")}
              </h2>
              <p className="mb-4">{t("sections.jurisdiction.content")}</p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2 p-4 bg-gray-100 rounded-b-lg">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-white text-gray-700 border border-gray-300 font-medium px-4 py-2 rounded-md hover:bg-gray-50"
            >
              {t("closeButton")}
            </Button>
            <Button
              onClick={() => {
                onAgree();
                setIsOpen(false);
              }}
              disabled={!canAgree}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {t("agreeButton")}
            </Button>
          </div>

          {/* Close Button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <Cross2Icon className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

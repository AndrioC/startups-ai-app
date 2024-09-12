import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { ExternalPageSettingsSchema } from "@/lib/schemas/schema-external-page-setting";

type FormSchema = z.infer<ReturnType<typeof ExternalPageSettingsSchema>>;

interface TabData {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  benefits?: string[];
  disabled?: boolean;
}

const initialTabs: TabData[] = [
  {
    title: "Startups",
    buttonText: "Sou um fundador",
    buttonLink: "https://sgl.startups-globallink.com/",
    benefits: ["Benefício 1", "Benefício 2", "Benefício 3"],
  },
  {
    title: "Investidores",
    buttonText: "Sou um investidor",
    buttonLink: "https://sgl.startups-globallink.com/",
    benefits: ["Benefício 1", "Benefício 2", "Benefício 3"],
  },
  {
    title: "Mentores",
    buttonText: "Sou um mentor",
    buttonLink: "https://sgl.startups-globallink.com/",
    benefits: ["Benefício 1", "Benefício 2", "Benefício 3"],
    disabled: true,
  },
  {
    title: "Patrocinadores",
    buttonText: "Sou um patrocinador",
    buttonLink: "https://sgl.startups-globallink.com/",
    benefits: ["Benefício 1", "Benefício 2", "Benefício 3"],
    disabled: true,
  },
];

interface ExternalPageSettingsCustomTabsProps {
  enabledTabs: boolean[];
  control: Control<FormSchema>;
  errors: FieldErrors<FormSchema>;
}

export default function ExternalPageSettingsCustomTabs({
  enabledTabs,
  control,
  errors,
}: ExternalPageSettingsCustomTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const getError = (tabIndex: number, field: string) => {
    const tabErrors = errors.tabs?.[tabIndex] as
      | Record<string, any>
      | undefined;
    return tabErrors?.[field]?.message as string | undefined;
  };

  const getBenefitError = (tabIndex: number, index: number) => {
    const tabErrors = errors.tabs?.[tabIndex] as
      | Record<string, any>
      | undefined;
    return tabErrors?.benefits?.[index]?.message as string | undefined;
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center gap-x-40 border-b border-gray-300">
        {initialTabs.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={() => !tab.disabled && setActiveTab(index)}
              className={`px-4 py-2 text-sm sm:text-base ${
                !enabledTabs[index]
                  ? "text-gray-300 cursor-not-allowed"
                  : activeTab === index
                    ? "text-gray-800"
                    : "text-gray-500"
              }`}
              disabled={!enabledTabs[index]}
              aria-selected={activeTab === index}
              role="tab"
            >
              {tab.title}
            </button>
            {activeTab === index && enabledTabs[index] && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>
      {initialTabs.map(
        (tab, tabIndex) =>
          enabledTabs[tabIndex] && (
            <div
              key={tabIndex}
              className={`mt-6 space-y-4 ${activeTab === tabIndex ? "" : "hidden"}`}
              role="tabpanel"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`tabs.${tabIndex}.title`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">Título do card</span>
                    <p className="text-xs text-muted-foreground text-right">
                      (max: 30 caracteres)
                    </p>
                  </Label>
                  <Controller
                    name={`tabs.${tabIndex}.title`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id={`tabs.${tabIndex}.title`}
                          placeholder={tab.title}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                          maxLength={30}
                          aria-invalid={!!getError(tabIndex, "title")}
                          aria-describedby={
                            getError(tabIndex, "title")
                              ? `tabs.${tabIndex}.title-error`
                              : undefined
                          }
                        />
                        {getError(tabIndex, "title") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`tabs.${tabIndex}.title-error`}
                            role="alert"
                          >
                            {getError(tabIndex, "title")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`tabs.${tabIndex}.buttonText`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">Texto do botão</span>
                    <p className="text-xs text-muted-foreground text-right">
                      (max: 18 caracteres)
                    </p>
                  </Label>
                  <Controller
                    name={`tabs.${tabIndex}.buttonText`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id={`tabs.${tabIndex}.buttonText`}
                          placeholder={tab.buttonText}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                          maxLength={18}
                          aria-invalid={!!getError(tabIndex, "buttonText")}
                          aria-describedby={
                            getError(tabIndex, "buttonText")
                              ? `tabs.${tabIndex}.buttonText-error`
                              : undefined
                          }
                        />
                        {getError(tabIndex, "buttonText") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`tabs.${tabIndex}.buttonText-error`}
                            role="alert"
                          >
                            {getError(tabIndex, "buttonText")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`tabs.${tabIndex}.buttonLink`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">Link do botão</span>
                  </Label>
                  <Controller
                    name={`tabs.${tabIndex}.buttonLink`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id={`tabs.${tabIndex}.buttonLink`}
                          placeholder={tab.buttonLink}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                          aria-invalid={!!getError(tabIndex, "buttonLink")}
                          aria-describedby={
                            getError(tabIndex, "buttonLink")
                              ? `tabs.${tabIndex}.buttonLink-error`
                              : undefined
                          }
                        />
                        {getError(tabIndex, "buttonLink") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`tabs.${tabIndex}.buttonLink-error`}
                            role="alert"
                          >
                            {getError(tabIndex, "buttonLink")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                {tab.benefits?.map((benefit, index) => (
                  <div key={index} className="space-y-2">
                    <Label
                      htmlFor={`tabs.${tabIndex}.benefits.${index}`}
                      className="flex items-center gap-2"
                    >
                      <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                      <span className="text-gray-500">{`${index + 1}° benefício`}</span>
                      <p className="text-xs text-muted-foreground text-right">
                        (max: 30 caracteres)
                      </p>
                    </Label>
                    <Controller
                      name={`tabs.${tabIndex}.benefits.${index}`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="text"
                            id={`tabs.${tabIndex}.benefits.${index}`}
                            placeholder={benefit}
                            className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                            maxLength={30}
                            aria-invalid={!!getBenefitError(tabIndex, index)}
                            aria-describedby={
                              getBenefitError(tabIndex, index)
                                ? `tabs.${tabIndex}.benefits.${index}-error`
                                : undefined
                            }
                          />
                          {getBenefitError(tabIndex, index) && (
                            <p
                              className="mt-1 text-sm text-red-500"
                              id={`tabs.${tabIndex}.benefits.${index}-error`}
                              role="alert"
                            >
                              {getBenefitError(tabIndex, index)}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}

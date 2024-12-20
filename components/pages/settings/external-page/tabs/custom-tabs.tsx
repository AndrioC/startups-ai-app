import React, { useCallback, useEffect, useState } from "react";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { z } from "zod";

import investorCardImage from "@/assets/img/investor-card-image.svg";
import mentorCardImage from "@/assets/img/mentor-card-image.svg";
import sponsorCardImage from "@/assets/img/sponsor-card-image.svg";
import startupCardImage from "@/assets/img/startup-card-image.svg";
import { Label } from "@/components/ui/label";
import { useExternalPageSettingsData } from "@/contexts/FormExternalPageSettings";
import { ExternalPageSettingsSchema } from "@/lib/schemas/schema-external-page-setting";

type FormSchema = z.infer<ReturnType<typeof ExternalPageSettingsSchema>>;

interface TabData {
  tab_number: number;
  is_enabled: boolean;
  tab_card: {
    title: string;
    buttonText: string;
    buttonLink: string;
    benefits: string[];
  } | null;
}

interface ExternalPageSettingsCustomTabsProps {
  control: Control<FormSchema>;
  errors: FieldErrors<FormSchema>;
  enabledTabs: boolean[];
}

export default function ExternalPageSettingsCustomTabs({
  control,
  errors,
  enabledTabs,
}: ExternalPageSettingsCustomTabsProps) {
  const t = useTranslations("admin.settings.externalPage.customTabs");
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const { subdomain } = useParams();
  const buttonLinkUrl = `https://${subdomain}.startupsai.com.br/auth/login`;

  const { updateFormData } = useExternalPageSettingsData();

  const tabsData = useWatch({
    control,
    name: "enabled_tabs",
  });

  const cards = [
    {
      id: 1,
      title: t("cards.0.title"),
      button_text: t("cards.0.button_text"),
      button_link: "https://sai.startupsai.com.br",
      image: startupCardImage,
      bullet_points: [
        { id: 1, title: t("cards.0.bullet_points.0") },
        { id: 2, title: t("cards.0.bullet_points.1") },
        { id: 3, title: t("cards.0.bullet_points.2") },
      ],
    },
    {
      id: 2,
      title: t("cards.1.title"),
      button_text: t("cards.1.button_text"),
      button_link: "https://sai.startupsai.com.br",
      image: investorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.1.bullet_points.0") },
        { id: 2, title: t("cards.1.bullet_points.1") },
        { id: 3, title: t("cards.1.bullet_points.2") },
      ],
    },
    {
      id: 3,
      title: t("cards.2.title"),
      button_text: t("cards.2.button_text"),
      button_link: "https://sai.startupsai.com.br",
      image: mentorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.2.bullet_points.0") },
        { id: 2, title: t("cards.2.bullet_points.1") },
        { id: 3, title: t("cards.2.bullet_points.2") },
      ],
    },
    {
      id: 4,
      title: t("cards.3.title"),
      button_text: t("cards.3.button_text"),
      button_link: "https://sai.startupsai.com.br",
      image: sponsorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.3.bullet_points.0") },
        { id: 2, title: t("cards.3.bullet_points.1") },
        { id: 3, title: t("cards.3.bullet_points.2") },
      ],
    },
  ];

  const updateContextData = useCallback(
    (newTabsData: TabData[]) => {
      updateFormData({ enabled_tabs: newTabsData });
    },
    [updateFormData]
  );

  useEffect(() => {
    if (activeTab === null) {
      const firstEnabledTabIndex = enabledTabs.findIndex((tab) => tab);
      if (firstEnabledTabIndex !== -1) {
        setActiveTab(firstEnabledTabIndex);
      }
    }
  }, [enabledTabs, activeTab]);

  const handleTabClick = (index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (enabledTabs[index]) {
      setActiveTab(index);
    }
  };

  const getError = (tabIndex: number, field: string) => {
    const tabErrors = errors.enabled_tabs?.[tabIndex]?.tab_card as
      | Record<string, any>
      | undefined;
    return tabErrors?.[field]?.message as string | undefined;
  };

  const getBenefitError = (tabIndex: number, index: number) => {
    const tabErrors = errors.enabled_tabs?.[tabIndex]?.tab_card as
      | Record<string, any>
      | undefined;
    return tabErrors?.benefits?.[index]?.message as string | undefined;
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center gap-x-40 border-b border-gray-300">
        {tabsData.map((tab, index) => (
          <div key={index} className="relative">
            <button
              onClick={(event) => handleTabClick(index, event)}
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
              {cards[index].title}
            </button>
            {activeTab === index && enabledTabs[index] && (
              <motion.div
                layoutId="underline-external-settings"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </div>

      {tabsData.map(
        (tab, tabIndex) =>
          enabledTabs[tabIndex] && (
            <div
              key={tabIndex}
              className={`mt-6 space-y-4 ${
                activeTab === tabIndex ? "" : "hidden"
              }`}
              role="tabpanel"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor={`enabled_tabs.${tabIndex}.tab_card.title`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">{t("cardTitle")}</span>
                    <p className="text-xs text-muted-foreground text-right">
                      {t("maxCharacters", { count: 30 })}
                    </p>
                  </Label>
                  <Controller
                    name={`enabled_tabs.${tabIndex}.tab_card.title`}
                    control={control}
                    defaultValue={tab.tab_card?.title ?? ""}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id={`enabled_tabs.${tabIndex}.tab_card.title`}
                          placeholder={cards[tabIndex].title}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                          maxLength={30}
                          aria-invalid={!!getError(tabIndex, "title")}
                          aria-describedby={
                            getError(tabIndex, "title")
                              ? `enabled_tabs.${tabIndex}.tab_card.title-error`
                              : undefined
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            const newTabsData = [...tabsData];
                            if (newTabsData[tabIndex].tab_card) {
                              newTabsData[tabIndex].tab_card!.title =
                                e.target.value;
                              updateContextData(newTabsData);
                            }
                          }}
                          onFocus={() => setActiveTab(tabIndex)}
                        />
                        {getError(tabIndex, "title") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`enabled_tabs.${tabIndex}.tab_card.title-error`}
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
                    htmlFor={`enabled_tabs.${tabIndex}.tab_card.buttonText`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">{t("buttonText")}</span>
                    <p className="text-xs text-muted-foreground text-right">
                      {t("maxCharacters", { count: 18 })}
                    </p>
                  </Label>
                  <Controller
                    name={`enabled_tabs.${tabIndex}.tab_card.buttonText`}
                    control={control}
                    defaultValue={tab.tab_card?.buttonText ?? ""}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id={`enabled_tabs.${tabIndex}.tab_card.buttonText`}
                          placeholder={cards[tabIndex].button_text}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                          maxLength={18}
                          aria-invalid={!!getError(tabIndex, "buttonText")}
                          aria-describedby={
                            getError(tabIndex, "buttonText")
                              ? `enabled_tabs.${tabIndex}.tab_card.buttonText-error`
                              : undefined
                          }
                          onChange={(e) => {
                            field.onChange(e);
                            const newTabsData = [...tabsData];
                            if (newTabsData[tabIndex].tab_card) {
                              newTabsData[tabIndex].tab_card!.buttonText =
                                e.target.value;
                              updateContextData(newTabsData);
                            }
                          }}
                        />
                        {getError(tabIndex, "buttonText") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`enabled_tabs.${tabIndex}.tab_card.buttonText-error`}
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
                    htmlFor={`enabled_tabs.${tabIndex}.tab_card.buttonLink`}
                    className="flex items-center gap-2"
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                    <span className="text-gray-500">{t("buttonLink")}</span>
                  </Label>
                  <Controller
                    name={`enabled_tabs.${tabIndex}.tab_card.buttonLink`}
                    control={control}
                    defaultValue={buttonLinkUrl}
                    render={({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          value={buttonLinkUrl}
                          id={`enabled_tabs.${tabIndex}.tab_card.buttonLink`}
                          placeholder={cards[tabIndex].button_link}
                          className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD] cursor-not-allowed text-[#A7B6CD]"
                          aria-invalid={!!getError(tabIndex, "buttonLink")}
                          aria-describedby={
                            getError(tabIndex, "buttonLink")
                              ? `enabled_tabs.${tabIndex}.tab_card.buttonLink-error`
                              : undefined
                          }
                          disabled
                          readOnly
                        />
                        {getError(tabIndex, "buttonLink") && (
                          <p
                            className="mt-1 text-sm text-red-500"
                            id={`enabled_tabs.${tabIndex}.tab_card.buttonLink-error`}
                            role="alert"
                          >
                            {getError(tabIndex, "buttonLink")}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                {cards[tabIndex].bullet_points.map((bullet_point, index) => (
                  <div key={index} className="space-y-2">
                    <Label
                      htmlFor={`enabled_tabs.${tabIndex}.tab_card.benefits.${index}`}
                      className="flex items-center gap-2"
                    >
                      <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                      <span className="text-gray-500">{`${index + 1}° ${t("benefit")}`}</span>
                      <p className="text-xs text-muted-foreground text-right">
                        {t("maxCharacters", { count: 30 })}
                      </p>
                    </Label>
                    <Controller
                      name={`enabled_tabs.${tabIndex}.tab_card.benefits.${index}`}
                      control={control}
                      defaultValue={tab.tab_card?.benefits[index] ?? ""}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="text"
                            id={`enabled_tabs.${tabIndex}.tab_card.benefits.${index}`}
                            placeholder={bullet_point.title}
                            className="border rounded-md w-full h-[40px] pl-2 placeholder:font-light placeholder:text-[#A7B6CD]"
                            maxLength={30}
                            aria-invalid={!!getBenefitError(tabIndex, index)}
                            aria-describedby={
                              getBenefitError(tabIndex, index)
                                ? `enabled_tabs.${tabIndex}.tab_card.benefits.${index}-error`
                                : undefined
                            }
                            onChange={(e) => {
                              field.onChange(e);
                              const newTabsData = [...tabsData];
                              if (newTabsData[tabIndex].tab_card) {
                                newTabsData[tabIndex].tab_card!.benefits[
                                  index
                                ] = e.target.value;
                                updateContextData(newTabsData);
                              }
                            }}
                          />
                          {getBenefitError(tabIndex, index) && (
                            <p
                              className="mt-1 text-sm text-red-500"
                              id={`enabled_tabs.${tabIndex}.tab_card.benefits.${index}-error`}
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

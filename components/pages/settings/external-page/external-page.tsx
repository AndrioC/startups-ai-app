import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Link2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { z } from "zod";

import bannerCardExternalPageSettingsInfo from "@/assets/img/banner-card-external-page-settings-info.svg";
import buttonBannerCardExternalPageSettingsInfo from "@/assets/img/button-banner-card-external-page-settings-info.svg";
import freeTextCardExternalPageSettingsInfo from "@/assets/img/free-text-card-external-page-settings-info.svg";
import investorCardImage from "@/assets/img/investor-card-image.svg";
import linkVideoCardExternalPageSettingsInfo from "@/assets/img/link-video-card-external-page-settings-info.svg";
import mentorCardImage from "@/assets/img/mentor-card-image.svg";
import pageTitleCardExternalPageSettingsInfo from "@/assets/img/page-title-card-external-page-settings-info.svg";
import phraseOverBannerCardExternalPageSettingsInfo from "@/assets/img/phrase-over-banner-card-external-page-settings-info.svg";
import sponsorCardImage from "@/assets/img/sponsor-card-image.svg";
import startupCardImage from "@/assets/img/startup-card-image.svg";
import { Button } from "@/components/ui/button";
import { useExternalPageSettingsData } from "@/contexts/FormExternalPageSettings";
import { ExternalPageSettingsSchema } from "@/lib/schemas/schema-external-page-setting";

import TextEditor from "../text-editor";

import ExternalPageSettingsCustomTabs from "./tabs/custom-tabs";
import { ImageTooltip } from "./image-tooltip";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface BulletPoint {
  id: number;
  title: string;
}

interface Card {
  id: number;
  title: string;
  button_text: string;
  button_link: string;
  image: string;
  bullet_points: BulletPoint[];
}

export default function ExternalPageSettings() {
  const t = useTranslations("admin.settings.externalPage.externalPageSettings");
  const { data: session } = useSession();
  const { subdomain } = useParams();
  const organizationId = session?.user?.organization_id;
  const [bannerFileImage, setBannerFileImage] = useState<File | null>(null);
  const [enabledTabs, setEnabledTabs] = useState<boolean[]>([]);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    initialData,
    formData,
    refetch,
    logoBannerFile,
    setLogoBannerFile,
    updateFormData,
  } = useExternalPageSettingsData();

  const cards: Card[] = [
    {
      id: 1,
      title: t("cards.entrepreneurs.title"),
      button_text: t("cards.entrepreneurs.buttonText"),
      button_link: "https://sai.startupsai.com.br",
      image: startupCardImage,
      bullet_points: [
        { id: 1, title: t("cards.entrepreneurs.benefits.0") },
        { id: 2, title: t("cards.entrepreneurs.benefits.1") },
        { id: 3, title: t("cards.entrepreneurs.benefits.2") },
      ],
    },
    {
      id: 2,
      title: t("cards.investors.title"),
      button_text: t("cards.investors.buttonText"),
      button_link: "https://sai.startupsai.com.br",
      image: investorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.investors.benefits.0") },
        { id: 2, title: t("cards.investors.benefits.1") },
        { id: 3, title: t("cards.investors.benefits.2") },
      ],
    },
    {
      id: 3,
      title: t("cards.mentors.title"),
      button_text: t("cards.mentors.buttonText"),
      button_link: "https://sai.startupsai.com.br",
      image: mentorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.mentors.benefits.0") },
        { id: 2, title: t("cards.mentors.benefits.1") },
        { id: 3, title: t("cards.mentors.benefits.2") },
      ],
    },
    {
      id: 4,
      title: t("cards.sponsors.title"),
      button_text: t("cards.sponsors.buttonText"),
      button_link: "https://sai.startupsai.com.br",
      image: sponsorCardImage,
      bullet_points: [
        { id: 1, title: t("cards.sponsors.benefits.0") },
        { id: 2, title: t("cards.sponsors.benefits.1") },
        { id: 3, title: t("cards.sponsors.benefits.2") },
      ],
    },
  ];

  const formSchema = ExternalPageSettingsSchema();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  // Initialize enabled tabs based on formData
  useEffect(() => {
    if (formData.enabled_tabs) {
      const newEnabledTabs = cards.map((card) => {
        const enabledTab = formData.enabled_tabs.find(
          (tab) => tab.tab_number === card.id
        );
        return enabledTab ? enabledTab.is_enabled : false;
      });
      setEnabledTabs(newEnabledTabs);
    }
  }, [formData.enabled_tabs]);

  // Update form values when enabledTabs change
  useEffect(() => {
    if (formData.enabled_tabs) {
      setValue(
        "enabled_tabs",
        cards.map((card, index) => {
          const enabledTab = formData.enabled_tabs.find(
            (tab) => tab.tab_number === card.id
          );
          return {
            tab_number: card.id,
            is_enabled: enabledTabs[index],
            tab_card: enabledTab?.is_enabled
              ? {
                  title: enabledTab.tab_card?.title || card.title,
                  buttonText:
                    enabledTab.tab_card?.buttonText || card.button_text,
                  buttonLink:
                    enabledTab.tab_card?.buttonLink || card.button_link,
                  benefits:
                    enabledTab.tab_card?.benefits ||
                    card.bullet_points.map((point) => point.title),
                }
              : null,
          };
        })
      );
    }
  }, [enabledTabs, formData.enabled_tabs, setValue, cards]);

  // Reset form when formData changes
  useEffect(() => {
    reset(formData);
  }, [formData, reset]);

  const handleChange = (name: string, value: any) => {
    setValue(name as any, value);

    const updatedFormData = { ...formData, [name]: value };
    updateFormData(updatedFormData);
  };

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  const onSubmit = async (
    data: z.infer<typeof formSchema>,
    event: React.BaseSyntheticEvent | undefined
  ) => {
    if (event) {
      event.preventDefault();
    }

    setIsSubmitting(true);

    const formData = new FormData();

    if (data.loadBanner instanceof File) {
      formData.append("load_banner", data.loadBanner);
    }

    formData.append("page_type", "ORGANIZATION");
    formData.append("banner_phrase", data.bannerPhrase || "");
    formData.append("show_learn_more", data.showLearnMore ? "true" : "false");
    formData.append("learn_more_text", data.learnMoreText || "");
    formData.append("learn_more_link", data.learnMoreLink || "");
    formData.append("page_title", data.pageTitle || "");
    formData.append("link_video", data.linkVideo || "");
    formData.append("free_text", data.freeText || "");

    const buttonLinkUrl = `https://${subdomain}.startupsai.com.br/auth/login`;

    const enabledTabsData = data.enabled_tabs.map((tab) => ({
      tab_number: tab.tab_number,
      is_enabled: tab.is_enabled,
      tab_card: tab.is_enabled
        ? {
            ...tab.tab_card,
            buttonLink: buttonLinkUrl,
          }
        : null,
    }));

    formData.append("enabled_tabs", JSON.stringify(enabledTabsData));

    try {
      const response = await fetch(
        `/api/settings/${organizationId}/external-page-settings`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(t("toasts.settingsError"));
      }

      toast.success(t("toasts.settingsSaved"), {
        autoClose: 3000,
        position: "top-center",
      });
      await refetch();
    } catch (error) {
      toast.error(t("toasts.settingsError"), {
        autoClose: 3000,
        position: "top-center",
      });
      console.error("Error saving settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | string | null) => void
  ) => {
    const selectedFile = e.target.files?.[0];
    setFileSizeError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileSizeError(t("banner.fileError"));
        setBannerFileImage(null);
        onChange(null);
      } else {
        setBannerFileImage(selectedFile);
        onChange(selectedFile);
        setLogoBannerFile(URL.createObjectURL(selectedFile));
        handleChange("loadBanner", selectedFile);
      }
    } else {
      onChange(logoBannerFile || null);
    }
  };

  const handlePreview = async () => {
    const formData = watch();
    let bannerUrl = null;

    if (bannerFileImage instanceof File) {
      bannerUrl = URL.createObjectURL(bannerFileImage);
    } else if (logoBannerFile) {
      bannerUrl = logoBannerFile;
    }

    const previewData = {
      headerLogo: initialData.headerLogoUrl || session?.user?.logo_img || null,
      loadBannerUrl: bannerUrl,
      bannerPhrase: formData.bannerPhrase || "",
      showLearnMore: formData.showLearnMore || false,
      learnMoreText: formData.learnMoreText || "",
      learnMoreLink: formData.learnMoreLink || "",
      pageTitle: formData.pageTitle || "",
      linkVideo: formData.linkVideo || "",
      freeText: formData.freeText || "",
      enabled_tabs: formData.enabled_tabs.map((tab) => ({
        tab_number: tab.tab_number,
        is_enabled: tab.is_enabled,
        tab_card:
          tab.is_enabled && tab.tab_card
            ? {
                title: tab.tab_card.title,
                buttonText: tab.tab_card.buttonText,
                buttonLink: tab.tab_card.buttonLink,
                benefits: tab.tab_card.benefits,
              }
            : null,
      })),
    };

    const encodedData = encodeURIComponent(JSON.stringify(previewData));
    window.open(`/page-preview?data=${encodedData}`, "_blank");
  };

  const handleCopyLink = () => {
    const link = `https://${subdomain}.startupsai.com.br`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success(t("toasts.linkCopied"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error(t("toasts.copyError"), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const handleTabToggle = (index: number) => {
    const newEnabledTabs = [...enabledTabs];
    newEnabledTabs[index] = !newEnabledTabs[index];
    setEnabledTabs(newEnabledTabs);

    const updatedTabData = {
      tab_number: cards[index].id,
      is_enabled: newEnabledTabs[index],
      tab_card: newEnabledTabs[index]
        ? {
            title: "",
            buttonText: "",
            buttonLink: "",
            benefits: ["", "", ""],
          }
        : null,
    };

    setValue(`enabled_tabs.${index}`, updatedTabData);
  };

  const showLearnMore = watch("showLearnMore");

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="w-full px-4 mx-auto space-y-8">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex mt-5 flex-col">
              <div className="flex">
                <label
                  htmlFor="loadBanner"
                  className="flex items-center gap-2 text-[#2292EA]"
                >
                  <ImageTooltip
                    image={bannerCardExternalPageSettingsInfo}
                    alt="banner-card-external-page-settings-info"
                    width={300}
                    height={200}
                  >
                    <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
                  </ImageTooltip>
                  <span className="text-gray-500">{t("banner.label")}</span>
                </label>
                <div className="flex items-center gap-20">
                  <Controller
                    name="loadBanner"
                    control={control}
                    render={({ field: { ref, name, onBlur, onChange } }) => (
                      <div className="flex items-center space-x-2 flex-grow">
                        <input
                          type="file"
                          ref={ref}
                          name={name}
                          id={name}
                          onBlur={onBlur}
                          accept=".png, .jpeg, .jpg"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, onChange)}
                        />
                        <div className="relative flex items-center space-x-2 font-medium flex-grow">
                          <span
                            className="text-blue-500 cursor-pointer truncate flex-grow"
                            title={
                              bannerFileImage
                                ? bannerFileImage.name
                                : logoBannerFile || ""
                            }
                            onClick={() =>
                              window.open(
                                bannerFileImage
                                  ? URL.createObjectURL(bannerFileImage)
                                  : logoBannerFile,
                                "_blank"
                              )
                            }
                          >
                            {truncateFileName(
                              bannerFileImage
                                ? bannerFileImage.name
                                : logoBannerFile || t("banner.selectFile"),
                              30
                            )}
                          </span>
                          <button
                            type="button"
                            className="flex items-center justify-center w-9 h-9 bg-gray-500 rounded-full cursor-pointer"
                            onClick={() =>
                              document.getElementById(name)?.click()
                            }
                          >
                            <FaEdit className="text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {t("banner.maxSize")}
              </p>
              {fileSizeError && (
                <p className="mt-2 text-sm text-red-500">{fileSizeError}</p>
              )}
              {errors.loadBanner && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.loadBanner.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              type="button"
              variant="ghost"
              className="bg-white text-[#2292EA] font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:text-[#3686c3] border-2 border-[#2292EA] transition-colors duration-300 ease-in-out"
              onClick={handleCopyLink}
            >
              <Link2 className="w-5 h-5 mr-2" />
              {t("buttons.link")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="bg-white text-[#2292EA] font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:text-[#3686c3] border-2 border-[#2292EA] transition-colors duration-300 ease-in-out"
              onClick={handlePreview}
            >
              {t("buttons.preview")}
            </Button>
            <Button
              type="submit"
              variant="blue"
              className={`bg-[#2292EA] text-white font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <span>
                {isSubmitting ? t("buttons.saving") : t("buttons.save")}
              </span>
            </Button>
          </div>
        </div>

        {/* Banner Phrase */}
        <div className="space-y-2 w-full">
          <label htmlFor="bannerPhrase" className="flex items-center gap-2">
            <ImageTooltip
              image={phraseOverBannerCardExternalPageSettingsInfo}
              alt="phrase-over-banner-card-external-page-settings-info"
              width={300}
              height={200}
            >
              <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
            </ImageTooltip>
            <span className="text-gray-500">{t("bannerPhrase.label")}</span>
            <p className="text-xs text-muted-foreground text-right">
              {t("bannerPhrase.maxChars")}
            </p>
          </label>
          <input
            id="bannerPhrase"
            {...register("bannerPhrase")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
            maxLength={40}
            onChange={(e) => handleChange("bannerPhrase", e.target.value)}
          />
          {errors.bannerPhrase && (
            <p className="mt-2 text-sm text-red-500">
              {errors.bannerPhrase.message}
            </p>
          )}
        </div>

        {/* Learn More Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ImageTooltip
              image={buttonBannerCardExternalPageSettingsInfo}
              alt="button-banner-card-external-page-settings-info"
              width={300}
              height={200}
            >
              <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
            </ImageTooltip>
            <input
              id="showLearnMore"
              type="checkbox"
              {...register("showLearnMore")}
              className="appearance-none w-5 h-5 mr-2 border-2 border-blue-500 rounded checked:bg-blue-500 checked:border-0 cursor-pointer bg-white transition-colors duration-300 ease-in-out"
              onChange={(e) => handleChange("showLearnMore", e.target.checked)}
            />
            <label htmlFor="showLearnMore" className="flex items-center gap-2">
              <span className="text-gray-500">{t("learnMore.label")}</span>
            </label>
          </div>

          {showLearnMore && (
            <div className="flex space-x-4 max-w-[900px]">
              <div className="flex-1 space-y-2 mt-5">
                <label
                  htmlFor="learnMoreText"
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-500">
                    {t("learnMore.text.label")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("learnMore.text.maxChars")}
                  </span>
                </label>
                <input
                  id="learnMoreText"
                  {...register("learnMoreText")}
                  type="text"
                  className="w-full max-w-[450px] border rounded-md h-10 px-3"
                  maxLength={15}
                  onChange={(e) =>
                    handleChange("learnMoreText", e.target.value)
                  }
                />
                {errors.learnMoreText && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.learnMoreText.message}
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-2 mt-5">
                <label htmlFor="learnMoreLink">
                  <span className="text-gray-500">{t("learnMore.link")}</span>
                </label>
                <input
                  id="learnMoreLink"
                  {...register("learnMoreLink")}
                  type="text"
                  className="w-full max-w-[450px] border rounded-md h-10 px-3"
                  onChange={(e) =>
                    handleChange("learnMoreLink", e.target.value)
                  }
                />
                {errors.learnMoreLink && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.learnMoreLink.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Page Title */}
        <div className="space-y-2">
          <label htmlFor="pageTitle" className="flex items-center gap-2">
            <ImageTooltip
              image={pageTitleCardExternalPageSettingsInfo}
              alt="page-title-card-external-page-settings-info"
              width={300}
              height={200}
            >
              <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
            </ImageTooltip>
            <span className="text-gray-500">{t("pageTitle.label")}</span>
            <p className="text-xs text-muted-foreground text-right">
              {t("pageTitle.maxChars")}
            </p>
          </label>
          <input
            id="pageTitle"
            {...register("pageTitle")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
            maxLength={30}
            onChange={(e) => handleChange("pageTitle", e.target.value)}
          />
          {errors.pageTitle && (
            <p className="mt-2 text-sm text-red-500">
              {errors.pageTitle.message}
            </p>
          )}
        </div>

        {/* Video Link */}
        <div className="space-y-2">
          <label htmlFor="linkVideo" className="flex items-center gap-2">
            <ImageTooltip
              image={linkVideoCardExternalPageSettingsInfo}
              alt="link-video-card-external-page-settings-info"
              width={300}
              height={200}
            >
              <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
            </ImageTooltip>
            <span className="text-gray-500">{t("videoLink.label")}</span>
          </label>
          <input
            id="linkVideo"
            {...register("linkVideo")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
            onChange={(e) => handleChange("linkVideo", e.target.value)}
          />
          {errors.linkVideo && (
            <p className="mt-2 text-sm text-red-500">
              {errors.linkVideo.message}
            </p>
          )}
        </div>

        {/* Free Text */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="freeText" className="flex items-center gap-2">
            <ImageTooltip
              image={freeTextCardExternalPageSettingsInfo}
              alt="free-text-card-external-page-settings-info"
              width={300}
              height={200}
            >
              <QuestionMarkCircledIcon className="h-4 w-4 text-[#2292EA] font-bold cursor-help" />
            </ImageTooltip>
            <span className="text-gray-500">{t("freeText.label")}</span>
          </label>
          <Controller
            name="freeText"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange } }) => (
              <TextEditor
                value={value || ""}
                onChange={(newValue) => {
                  onChange(newValue);
                  handleChange("freeText", newValue);
                }}
              />
            )}
          />
          {errors.freeText && (
            <p className="mt-2 text-sm text-red-500">
              {errors.freeText.message}
            </p>
          )}
        </div>

        {/* Registration Calls */}
        <div className="flex flex-col space-y-8">
          <label
            htmlFor="callsForRegistration"
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">
              {t("registrationCalls.label")}
            </span>
          </label>
          <div className="flex mt-10 md:mt-28 gap-5 py-10 px-4 md:px-0 max-w-[900px]">
            {cards.map((card, index) => (
              <div key={card.id} className="flex flex-col items-center">
                <div className="bg-[#F9F9FC] rounded-[30px] shadow-lg w-full max-w-[270px] h-[424px] flex flex-col p-5 mb-4">
                  <div className="relative w-full bg-purple-400 left-1/2 transform -translate-x-1/2 mb-14">
                    <Image
                      src={card.image}
                      width={212}
                      height={210}
                      alt={`image-${card.title}`}
                      className="w-full object-cover absolute top-[-80px]"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-black text-[20px] font-bold mt-24">
                      {card.title}
                    </h3>
                    <ul className="flex flex-col gap-2 mt-2 list-none text-[#484849] font-semibold">
                      {card.bullet_points.map((bullet_point) => (
                        <li key={bullet_point.id}>{bullet_point.title}</li>
                      ))}
                    </ul>
                  </div>
                  <Button className="bg-[#0A2979] text-white rounded-full w-[200px] h-[50px] text-[15px] font-bold shadow-xl hover:bg-[#051b52] transition-colors duration-300 ease-in-out mt-auto">
                    {card.button_text}
                  </Button>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="appearance-none w-5 h-5 mr-2 border-2 rounded cursor-pointer bg-white transition-colors duration-300 ease-in-out
                      border-blue-500 checked:bg-blue-500 checked:border-0
                      disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    checked={enabledTabs[index]}
                    onChange={() => handleTabToggle(index)}
                    disabled={index >= cards.length - 2}
                  />
                  <span
                    className={`text-sm ${index >= cards.length - 2 ? "text-gray-400" : "text-gray-700"}`}
                  >
                    {t("registrationCalls.showOnPage")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="space-y-8">
          <ExternalPageSettingsCustomTabs
            control={control}
            errors={errors}
            enabledTabs={enabledTabs}
          />
        </div>
      </div>
    </form>
  );
}

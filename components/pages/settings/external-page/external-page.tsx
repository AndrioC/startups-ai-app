import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Link2 } from "lucide-react";
import Image from "next/image";
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
import { ExternalPageSettingsSchema } from "@/lib/schemas/schema-external-page-setting";

import TextEditor from "../text-editor";

import ExternalPageSettingsCustomTabs from "./tabs/custom-tabs";
import { ImageTooltip } from "./image-tooltip";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function ExternalPageSettings() {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [bannerFileImage, setBannerFileImage] = useState<File | null>(null);
  const [enabledTabs, setEnabledTabs] = useState([true, true, false, false]);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);

  const formSchema = ExternalPageSettingsSchema(enabledTabs);

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loadBanner: undefined,
      bannerPhrase: "",
      showLearnMore: false,
      learnMoreText: "",
      learnMoreLink: "",
      linkVideo: "",
      pageTitle: "",
      freeText: "",
      tabs: [
        { title: "", buttonText: "", buttonLink: "", benefits: ["", "", ""] },
        { title: "", buttonText: "", buttonLink: "", benefits: ["", "", ""] },
        { title: "", buttonText: "", buttonLink: "", benefits: ["", "", ""] },
        { title: "", buttonText: "", buttonLink: "", benefits: ["", "", ""] },
      ],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof formSchema>,
    event: React.BaseSyntheticEvent | undefined
  ) => {
    if (event) {
      event.preventDefault();
    }
    console.log(data);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => {
    const selectedFile = e.target.files?.[0];
    setFileSizeError(null);

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileSizeError(
          "O arquivo é maior que 2MB. Por favor, selecione um arquivo menor."
        );
        setBannerFileImage(null);
        onChange(null);
      } else {
        setBannerFileImage(selectedFile);
        onChange(selectedFile);
      }
    }
  };

  const handlePreview = async () => {
    const formData = watch();
    const previewData = {
      ...formData,
      enabledTabs,
      loadBanner: formData.loadBanner
        ? URL.createObjectURL(formData.loadBanner)
        : null,
    };

    const encodedData = encodeURIComponent(JSON.stringify(previewData));
    window.open(`/page-preview?data=${encodedData}`, "_blank");
  };

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
                  <span className="text-gray-500">Banner</span>
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
                            title={bannerFileImage ? bannerFileImage.name : ""}
                            onClick={() =>
                              bannerFileImage &&
                              window.open(
                                URL.createObjectURL(bannerFileImage),
                                "_blank"
                              )
                            }
                          >
                            {truncateFileName(
                              bannerFileImage
                                ? bannerFileImage.name
                                : "Selecionar arquivo",
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
                Tamanho máximo da imagem: 2MB
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              type="button"
              variant="ghost"
              className="bg-white text-[#2292EA] font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:text-[#3686c3] border-2 border-[#2292EA] transition-colors duration-300 ease-in-out"
            >
              <Link2 className="w-5 h-5 mr-2" />
              LINK
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="bg-white text-[#2292EA] font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:text-[#3686c3] border-2 border-[#2292EA] transition-colors duration-300 ease-in-out"
              onClick={handlePreview}
            >
              VISUALIZAR
            </Button>
            <Button
              type="submit"
              variant="blue"
              className="bg-[#2292EA] text-white font-medium uppercase text-[15px] rounded-[30px] w-[120px] h-[40px] shadow-xl hover:bg-[#3686c3] hover:text-white transition-colors duration-300 ease-in-out"
            >
              SALVAR
            </Button>
          </div>
        </div>
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
            <span className="text-gray-500">Frase sobre o banner</span>
            <p className="text-xs text-muted-foreground text-right">
              (max: 40 caracteres)
            </p>
          </label>
          <input
            id="bannerPhrase"
            {...register("bannerPhrase")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
            maxLength={40}
          />
          {errors.bannerPhrase && (
            <p className="mt-2 text-sm text-red-500">
              {errors.bannerPhrase.message}
            </p>
          )}
        </div>

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
              onChange={() => setShowLearnMore(!showLearnMore)}
            />
            <label htmlFor="showLearnMore" className="flex items-center gap-2">
              <span className="text-gray-500">
                Botão "Saiba mais" sobre o banner
              </span>
            </label>
          </div>

          {showLearnMore && (
            <div className="flex space-x-4 max-w-[900px]">
              <div className="flex-1 space-y-2 mt-5">
                <label
                  htmlFor="learnMoreText"
                  className="flex items-center gap-2"
                >
                  <span className="text-gray-500">Texto</span>
                  <span className="text-xs text-muted-foreground">
                    (max: 15 caracteres)
                  </span>
                </label>
                <input
                  id="learnMoreText"
                  {...register("learnMoreText")}
                  type="text"
                  className="w-full max-w-[450px] border rounded-md h-10 px-3"
                  maxLength={15}
                />
                {errors.learnMoreText && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.learnMoreText.message}
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-2 mt-5">
                <label htmlFor="learnMoreLink">
                  <span className="text-gray-500">Link</span>
                </label>
                <input
                  id="learnMoreLink"
                  {...register("learnMoreLink")}
                  type="text"
                  className="w-full max-w-[450px] border rounded-md h-10 px-3"
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
            <span className="text-gray-500">Título da página</span>
            <p className="text-xs text-muted-foreground text-right">
              (max: 30 caracteres)
            </p>
          </label>
          <input
            id="pageTitle"
            {...register("pageTitle")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
            maxLength={30}
          />
          {errors.pageTitle && (
            <p className="mt-2 text-sm text-red-500">
              {errors.pageTitle.message}
            </p>
          )}
        </div>

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
            <span className="text-gray-500">Link para o vídeo</span>
          </label>
          <input
            id="linkVideo"
            {...register("linkVideo")}
            type="text"
            className="border rounded-md w-[900px] h-[40px] pl-2"
          />
          {errors.linkVideo && (
            <p className="mt-2 text-sm text-red-500">
              {errors.linkVideo.message}
            </p>
          )}
        </div>

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
            <span className="text-gray-500">Texto livre para a página</span>
          </label>
          <Controller
            name="freeText"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange } }) => (
              <TextEditor value={value || ""} onChange={onChange} />
            )}
          />
          {errors.freeText && (
            <p className="mt-2 text-sm text-red-500">
              {errors.freeText.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-8">
          <label
            htmlFor="callsForRegistration"
            className="flex items-center gap-2"
          >
            <span className="text-gray-500">Chamadas para o cadastro</span>
          </label>
          <div className="flex mt-10 md:mt-28 gap-5 py-10 px-4 md:px-0 max-w-[900px]">
            {cards.map((card, index) => (
              <div key={index} className="flex flex-col items-center">
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
                    onChange={() => {
                      const newEnabledTabs = [...enabledTabs];
                      newEnabledTabs[index] = !newEnabledTabs[index];
                      setEnabledTabs(newEnabledTabs);
                    }}
                    disabled={index >= cards.length - 2}
                  />
                  <span
                    className={`text-sm ${index >= cards.length - 2 ? "text-gray-400" : "text-gray-700"}`}
                  >
                    Exibir na página
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <ExternalPageSettingsCustomTabs
            control={control}
            enabledTabs={enabledTabs}
            errors={errors}
          />
        </div>
      </div>
    </form>
  );
}

const cards = [
  {
    id: 1,
    title: "Empreendedores",
    button_text: "Sou empreendedor",
    image: startupCardImage,
    bullet_points: [
      {
        id: 1,
        title: "Aceleração Gratuita",
      },
      {
        id: 2,
        title: "Mentorias Individuais",
      },
      {
        id: 3,
        title: "Conexão com o Ecossistema",
      },
    ],
  },
  {
    id: 2,
    title: "Investidores",
    button_text: "Sou investidor",
    image: investorCardImage,
    bullet_points: [
      {
        id: 1,
        title: "Conexão com Startups",
      },
      {
        id: 2,
        title: "Oportunidades Exclusivas",
      },
      {
        id: 3,
        title: "Demodays",
      },
    ],
  },
  {
    id: 3,
    title: "Mentores",
    button_text: "Sou mentor",
    image: mentorCardImage,
    bullet_points: [
      {
        id: 1,
        title: "Give back",
      },
      {
        id: 2,
        title: "Visibilidade no Ecossistema",
      },
      {
        id: 3,
        title: "Eventos Exclusivos",
      },
    ],
  },
  {
    id: 4,
    title: "Patrocinadores",
    button_text: "Sou patrocinador",
    image: sponsorCardImage,
    bullet_points: [
      {
        id: 1,
        title: "Visibilidade da marca",
      },
      {
        id: 2,
        title: "Acesso VIP",
      },
      {
        id: 3,
        title: "Eventos exclusivos",
      },
    ],
  },
];

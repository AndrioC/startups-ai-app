"use client";

import { useMemo } from "react";
import { PageType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import investorCardImage from "@/assets/img/investor-card-image.svg";
import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import mentorCardImage from "@/assets/img/mentor-card-image.svg";
import sponsorCardImage from "@/assets/img/sponsor-card-image.svg";
import startupCardImage from "@/assets/img/startup-card-image.svg";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";

interface FormattedSettings {
  headerLogoUrl: string;
  loadBanner: string;
  loadBannerUrl: string;
  bannerPhrase: string;
  showLearnMore: boolean;
  learnMoreText: string;
  learnMoreLink: string;
  pageTitle: string;
  linkVideo: string;
  freeText: string;
  enabled_tabs: EnabledTab[];
}

interface EnabledTab {
  tab_number: number;
  is_enabled: boolean;
  tab_card: TabCard | null;
}

interface TabCard {
  title: string;
  buttonText: string;
  buttonLink: string;
  benefits: string[];
}

function getEmbedUrl(url: string): string {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname.includes("youtube.com") ||
      parsedUrl.hostname.includes("youtu.be")
    ) {
      const videoId =
        parsedUrl.searchParams.get("v") || parsedUrl.pathname.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    if (
      parsedUrl.hostname.includes("dailymotion.com") ||
      parsedUrl.hostname.includes("dai.ly")
    ) {
      const videoId = parsedUrl.pathname.split("/").pop()?.split("_")[0];
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    }

    return url;
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return "";
  }
}
export default function HomeComponent() {
  const { subdomain } = useParams();

  const { data, isLoading, isError } = useLoadExternalSettings(
    subdomain as string
  );

  const embedUrl = useMemo(
    () => getEmbedUrl(data?.linkVideo!),
    [data?.linkVideo]
  );

  const bannerStyle = useMemo(() => {
    if (data?.loadBannerUrl) {
      return {
        backgroundImage: `url(${data?.loadBannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return {
      backgroundColor: "#f0f0f0",
    };
  }, [data?.loadBannerUrl]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error loading organization data</div>;
  }

  const logoUrl = data?.headerLogoUrl || logoPlaceholder.src;

  const updatedCards = data?.enabled_tabs
    .filter((tab) => tab.is_enabled && tab.tab_card)
    .map((tab) => {
      const existingCard = cards.find((card) => card.id === tab.tab_number);
      if (!existingCard) return null;

      return {
        ...existingCard,
        title: tab?.tab_card?.title || existingCard.title,
        button_text: tab?.tab_card?.buttonText || existingCard.button_text,
        button_link: tab?.tab_card?.buttonLink,
        bullet_points: tab?.tab_card?.benefits.map((benefit, index) => ({
          id: `benefit-${tab.tab_number}-${index}`,
          title: benefit,
        })),
      };
    })
    .filter(Boolean);

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex items-center justify-between bg-white h-[80px] px-4 md:px-10 mb-8">
        <div className="flex items-center justify-between w-full py-4 md:py-16 mt-8">
          <Image
            src={logoUrl}
            alt={`${subdomain}-logo`}
            width={275}
            height={80}
          />
          <Link href={"/auth/login"}>
            <Button className="bg-[#383838] bg-opacity-78 text-white rounded-full w-[120px] h-[40px] text-[16px] md:text-[20px] font-bold md:mr-16 uppercase shadow-xl hover:bg-[#282727] hover:text-white transition-colors duration-300 ease-in-out">
              Entrar
            </Button>
          </Link>
        </div>
      </header>
      <section>
        <div
          className="flex flex-col items-center justify-center bg-cover bg-center h-[400px] w-full"
          style={bannerStyle}
        >
          <h1 className="text-white text-[32px] w-[300px] md:text-[64px] font-extrabold text-center md:text-left p-4 md:p-14 md:w-[700px] md:self-start">
            {data?.bannerPhrase}
          </h1>
          <Link href={data?.learnMoreLink ?? "/"}>
            <Button className="bg-[#FC8847] text-[#262728] font-bold text-[16px] md:text-[20px] rounded-[30px] w-[150px] md:w-[200px] h-[40px] md:h-[50px] shadow-xl hover:bg-[#cd6930] transition-colors duration-300 ease-in-out mt-4 md:mt-0">
              {data?.learnMoreText}
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center mt-10">
        <h2 className="text-black text-[32px] md:text-[48px] font-semibold">
          {data?.pageTitle}
        </h2>
        {embedUrl && (
          <div className="mt-5 w-full p-2 md:p-0 max-w-[640px]">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded Video"
              ></iframe>
            </div>
          </div>
        )}

        <div
          className="mt-10 mx-4 md:mx-[90px] text-[16px] md:text-[20px] text-justify font-normal leading-7 text-black"
          dangerouslySetInnerHTML={{ __html: data?.freeText || "" }}
        />
      </section>

      <section className="flex flex-wrap items-center justify-center mt-10 md:mt-28 gap-5 py-10 px-4 md:px-0">
        {updatedCards?.map((card, index) => (
          <div
            key={index}
            className="bg-[#F9F9FC] rounded-[30px] shadow-lg w-full max-w-[270px] h-[424px] flex items-center flex-col p-5 mb-20 lg:mb-0"
          >
            <div className="relative w-full bg-purple-400 left-1/2 transform -translate-x-1/2 mb-14">
              <Image
                src={card?.image}
                width={212}
                height={210}
                alt={`image-${card?.title}`}
                className="w-full object-cover absolute top-[-80px]"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="text-black text-[20px] font-bold mt-24">
                {card?.title}
              </h3>
              <ul className="flex flex-col gap-2 mt-2 list-none text-[#484849] font-semibold">
                {card?.bullet_points?.map((bullet_point) => (
                  <li key={bullet_point.id}>{bullet_point.title}</li>
                ))}
              </ul>
            </div>
            <Button className="bg-[#0A2979] text-white rounded-full w-[200px] h-[50px] text-[15px] font-bold shadow-xl hover:bg-[#051b52] transition-colors duration-300 ease-in-out mt-auto">
              {card?.button_text}
            </Button>
          </div>
        ))}
      </section>
    </div>
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

const useLoadExternalSettings = (slug: string) =>
  useQuery<FormattedSettings>({
    queryKey: ["external-settings"],
    queryFn: () =>
      axios
        .get(
          `/api/load-settings/${slug}/load-external-settings?pageType=${PageType.ORGANIZATION}`
        )
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });

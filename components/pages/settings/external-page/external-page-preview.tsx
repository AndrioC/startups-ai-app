import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import investorCardImage from "@/assets/img/investor-card-image.svg";
import mentorCardImage from "@/assets/img/mentor-card-image.svg";
import sponsorCardImage from "@/assets/img/sponsor-card-image.svg";
import startupCardImage from "@/assets/img/startup-card-image.svg";
import { Button } from "@/components/ui/button";

type PreviewProps = {
  headerLogo: string;
  loadBanner: string | null;
  bannerPhrase: string;
  showLearnMore: boolean;
  learnMoreText: string;
  learnMoreLink: string;
  pageTitle: string;
  linkVideo: string;
  freeText: string;
  enabledTabs: boolean[];
  tabs: {
    title: string;
    buttonText: string;
    buttonLink: string;
    benefits: string[];
  }[];
};

const cardImages = [
  startupCardImage,
  investorCardImage,
  mentorCardImage,
  sponsorCardImage,
];

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

export function PreviewComponent({
  headerLogo,
  loadBanner,
  bannerPhrase,
  showLearnMore,
  learnMoreText,
  learnMoreLink,
  pageTitle,
  linkVideo,
  freeText,
  enabledTabs,
  tabs,
}: PreviewProps) {
  const embedUrl = useMemo(() => getEmbedUrl(linkVideo), [linkVideo]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex items-center justify-between bg-white h-[80px] px-4 md:px-10">
        <div className="flex items-center justify-between w-full py-4 md:py-16">
          {headerLogo ? (
            <Image src={headerLogo} alt="logo" width={275} height={80} />
          ) : (
            <div className="text-2xl font-bold text-primary">Sem imagem</div>
          )}
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
          style={{
            backgroundImage: `url(${loadBanner || "/page-bg.svg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h1 className="text-white text-[32px] w-[300px] md:text-[64px] font-extrabold text-center md:text-left p-4 md:p-14 md:w-[700px] md:self-start">
            {bannerPhrase}
          </h1>
          {showLearnMore && (
            <Button
              className="bg-[#FC8847] text-[#262728] font-bold text-[16px] md:text-[20px] rounded-[30px] w-[150px] md:w-[200px] h-[40px] md:h-[50px] shadow-xl hover:bg-[#cd6930] transition-colors duration-300 ease-in-out mt-4 md:mt-0"
              onClick={() => window.open(learnMoreLink, "_blank")}
            >
              {learnMoreText}
            </Button>
          )}
        </div>
      </section>

      <section className="flex flex-col items-center mt-10">
        <h2 className="text-black text-[32px] md:text-[48px] font-semibold">
          {pageTitle}
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
          dangerouslySetInnerHTML={{ __html: freeText }}
        />
      </section>

      <section className="flex flex-wrap items-center justify-center mt-10 md:mt-28 gap-5 py-10 px-4 md:px-0">
        {tabs.map((tab, index) => {
          if (!enabledTabs[index]) return null;
          return (
            <div
              key={index}
              className="bg-[#F9F9FC] rounded-[30px] shadow-lg w-full max-w-[270px] h-[424px] flex items-center flex-col p-5 mb-20 lg:mb-0"
            >
              <div className="relative w-full bg-purple-400 left-1/2 transform -translate-x-1/2 mb-14">
                <Image
                  src={cardImages[index]}
                  width={212}
                  height={210}
                  alt={`image-${tab.title}`}
                  className="w-full object-cover absolute top-[-80px]"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-black text-[20px] font-bold mt-24">
                  {tab.title}
                </h3>
                <ul className="flex flex-col gap-2 mt-2 list-none text-[#484849] font-semibold">
                  {tab.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <Button
                className="bg-[#0A2979] text-white rounded-full w-[200px] h-[50px] text-[15px] font-bold shadow-xl hover:bg-[#051b52] transition-colors duration-300 ease-in-out mt-auto"
                onClick={() => window.open(tab.buttonLink, "_blank")}
              >
                {tab.buttonText}
              </Button>
            </div>
          );
        })}
      </section>
    </div>
  );
}

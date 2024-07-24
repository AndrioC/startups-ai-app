"use client";

import Image from "next/image";

import investorCardImage from "@/assets/img/investor-card-image.svg";
import sriLogo from "@/assets/img/logos/sri-logo.svg";
import mentorCardImage from "@/assets/img/mentor-card-image.svg";
import sponsorCardImage from "@/assets/img/sponsor-card-image.svg";
import startupCardImage from "@/assets/img/startup-card-image.svg";
import { Button } from "@/components/ui/button";

export default function HomeComponent() {
  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex items-center justify-between bg-white h-[80px] px-10">
        <div className="flex items-center justify-between w-full py-16">
          <Image src={sriLogo} alt="sr-ligo" width={275} height={80} />
          <Button className="bg-[#383838] bg-opacity-78 text-white rounded-full w-[120px] h-[40px] text-[20px] font-bold mr-16 uppercase shadow-xl hover:bg-[#282727] hover:text-white transition-colors duration-300 ease-in-out">
            Entrar
          </Button>
        </div>
      </header>
      <section>
        <div className="flex flex-col items-center background-image h-[400px] w-full">
          <h1 className="text-white text-[64px] font-extrabold self-start p-14 w-[700px] text-center">
            As inscrições estão abertas!
          </h1>
          <Button className="bg-[#FC8847] text-[#262728] font-bold text-[20px] rounded-[30px] w-[200px] h-[50px] shadow-xl hover:bg-[#cd6930] transition-colors duration-300 ease-in-out">
            Saiba mais
          </Button>
        </div>
      </section>

      <section className="flex flex-col items-center mt-10">
        <h2 className="text-black text-[48px] font-semibold">
          Bem-vindo à Inovativa!
        </h2>
        <iframe
          className="mt-5"
          width="640"
          height="360"
          src="https://www.youtube.com/embed/-ukQfdscl1g"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube Video"
        ></iframe>

        <p className="mt-10 mx-[90px] text-[20px] text-justify font-normal leading-7 text-black">
          O InovAtiva apoia o desenvolvimento do ecossistema de empreendedorismo
          inovador no Brasil. Os programas e eventos do InovAtiva promovem
          diferentes oportunidades de aceleração de negócios inovadores, conexão
          com potenciais investidores e parceiros, e capacitação de
          empreendedores. Conheça e faça parte desta iniciativa que, desde 2013,
          já ajudou a impulsionar mais de 3,9 mil negócios por todo o país.
        </p>
      </section>

      <section className="flex flex-wrap items-center justify-center mt-28 gap-5 py-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#F9F9FC] rounded-[30px]  shadow-lg w-[270px] h-[424px] flex flex-col items-center p-5"
          >
            <div className="relative w-full bg-purple-400 left-1/2 transform -translate-x-1/2 mb-14">
              <Image
                src={card.image}
                width={212}
                height={210}
                alt={`image-${card.title}`}
                className="w-full object-cover absolute top-[-80px]"
              />
            </div>
            <h3 className="text-black text-[20px] font-bold mt-24 self-start">
              {card.title}
            </h3>
            <ul className="flex flex-col self-start gap-2 mt-2 list-none text-[#484849] font-semibold">
              {card.bullet_points.map((bullet_point) => (
                <li key={bullet_point.id}>{bullet_point.title}</li>
              ))}
            </ul>
            <Button className="bg-[#0A2979] text-white rounded-full w-[200px] h-[50px] text-[15px] font-bold shadow-xl hover:bg-[#051b52] transition-colors duration-300 ease-in-out mt-10">
              {card.button_text}
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
    button_text: "Sou patronicador",
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

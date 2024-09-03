"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";

import ProfileListModal from "./profile-list-modal";
import StartupProfileMarkDown from "./startup-profile-markdown";

export default function ProfileDataForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { initialData } = useFormStartupDataState();

  return (
    <div className="bg-gray-100 font-sans">
      <div className="flex justify-between mb-4">
        <div className="flex flex-col text-gray-500 gap-5">
          <h1 className="text-2xl font-semibold">
            PERFIL DA STARTUP GERADO PELA I.A.
          </h1>
          <span className="text-xl font-semibold mr-2">NOTA: 7,8</span>
          <p className="text-sm text-gray-500 font-normal">
            Mantenha o Perfil de sua Startup sempre atualizado para melhorar a
            nota e para facilitar a busca por investidores.
          </p>
        </div>
        <div className="flex flex-col">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-full px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => {
              console.log("Generate Pitchdeck clicked");
            }}
          >
            <Sparkles size={20} />
            ATUALIZAR PERFIL
          </Button>
          <Button
            variant="link"
            className="text-blue-500 hover:text-blue-700 text-xs"
            onClick={() => setIsModalOpen(true)}
          >
            VER PERFIS GERADOS
          </Button>
        </div>
      </div>

      <StartupProfileMarkDown profileData={initialData.startupProfile} />

      {/* <div className="bg-[#E5E7E7] rounded-lg shadow-md p-6 h-[800px] overflow-y-auto border-2 border-[#A5B5C1] custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4 text-gray-600">
          Perfil Comercial da Startup 2025
        </h2>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">Introdução</h3>
          <p className="text-gray-500">
            A Startup 2025, fundada em 6 de agosto de 2024, está localizada em
            Sobral, Ceará, Brasil, e atua na vertical de AdTech, focando em
            soluções inovadoras para o setor de publicidade digital. Com um
            modelo de negócio B2B, a startup se encontra na fase de escala,
            expandindo suas operações para novos mercados e consolidando sua
            presença no setor.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Proposta de Valor
          </h3>
          <p className="text-gray-500">
            A Startup 2025 oferece uma proposta de valor única, destacando-se
            pela sua capacidade de integrar tecnologia de ponta com soluções
            personalizadas para atender às necessidades específicas de seus
            clientes.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Diferenciais Competitivos
          </h3>
          <p className="text-gray-500">
            Os diferenciais competitivos da Startup 2025 incluem uma abordagem
            inovadora e adaptável, que permite a personalização de serviços e
            produtos digitais, além de um profundo entendimento do mercado de
            publicidade. Com uma equipe enxuta, mas altamente capacitada, a
            startup é ágil em suas operações, o que a torna uma opção atraente
            para empresas que buscam eficiência e resultados.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Desempenho Financeiro
          </h3>
          <p className="text-gray-500">
            Nos últimos 12 meses, a Startup 2025 gerou uma receita total de R$
            120.000, com uma receita média mensal de R$ 10.000. Nos últimos seis
            meses, a receita totalizou R$ 60.000, demonstrando um crescimento
            consistente e a capacidade de escalar suas operações.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Clientes e Equipe
          </h3>
          <p className="text-gray-500">
            Atualmente, a startup conta com 12 clientes e uma equipe reduzida de
            1 a 5 funcionários, o que permite uma comunicação direta e eficaz
            com seus parceiros e clientes, garantindo um atendimento
            personalizado e de qualidade.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Objetivos e Desafios
          </h3>
          <p className="text-gray-500">
            A Startup 2025 busca ativamente conexões com investidores e mentores
            para superar desafios como o acesso a financiamento privado e
            público. A busca por parcerias estratégicas é fundamental para a
            continuidade do crescimento e inovação da empresa.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">Palavras-chave</h3>
          <p className="text-gray-500">
            AdTech, Sobral, B2B, publicidade digital, inovação, tecnologia,
            escalabilidade, financiamento, parcerias, crescimento.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Perfil do Investidor Ideal
          </h3>
          <p className="text-gray-500">
            O investidor ideal para a Startup 2025 é aquele que possui
            experiência no setor de tecnologia e publicidade, que valoriza a
            inovação e está disposto a apoiar startups em fase de escala. Este
            investidor deve ter um perfil proativo, buscando não apenas retorno
            financeiro, mas também a oportunidade de contribuir para o
            desenvolvimento e a expansão da startup.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-600">
            Sugestões de Informações Adicionais
          </h3>
          <p className="font-semibold text-gray-600">
            Tópico 1: Informações que enriqueceriam o perfil elaborado e o
            tornaria ainda mais atraente para investidores, mas que não foram
            encontradas nos dados fornecidos:
          </p>
          <ul className="list-disc pl-5 mb-2 text-gray-500">
            <li>
              Detalhes sobre a tecnologia utilizada nos produtos e serviços
              oferecidos.
            </li>
            <li>Testemunhos ou estudos de caso de clientes satisfeitos.</li>
            <li>
              Informações sobre a estratégia de marketing e aquisição de
              clientes.
            </li>
          </ul>

          <p className="font-semibold mt-4 text-gray-600">
            Tópico 2: Informações que precisam necessariamente constar no Pitch
            Deck de uma startup, mas que não foram encontradas nos dados
            fornecidos:
          </p>
          <ul className="list-disc pl-5 text-gray-500">
            <li>Projeções financeiras para os próximos anos.</li>
            <li>Estrutura de custos e margens de lucro.</li>
            <li>Análise de mercado e concorrência.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold mb-2 text-gray-600">
            Avaliação do Perfil Elaborado
          </h3>
          <p className="text-gray-500">
            Nota: 8. A qualidade do perfil é boa, mas poderia ser aprimorada com
            informações mais detalhadas sobre a tecnologia e a estratégia de
            mercado, além de dados financeiros mais abrangentes.
          </p>
        </section>
      </div> */}
      <ProfileListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

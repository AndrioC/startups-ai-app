"use client";

import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

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
              Termos e Condições Gerais de Uso
            </Dialog.Title>
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="mt-4 max-h-[60vh] overflow-y-auto pr-4 text-gray-700"
            >
              <h2 className="text-base font-semibold mb-2 text-gray-800">
                1. Do Objeto
              </h2>
              <p className="mb-4">
                A Startups AI é uma Plataforma de Inteligência Artificial
                voltada para negócios de Startups. Através de nosso serviço de
                business-matchmaking, identificamos possibilidades de match com
                alta taxa de acurácia entre Startups e potenciais clientes
                (Governos e empresas que adotam a inovação aberta como
                estratégia para solucionar seus desafios), investidores,
                parceiros comerciais, outras startups e especialistas em
                negócios de Startups que possam ajudá-las a resolver problemas
                do negócio.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                2. Da Aceitação
              </h2>
              <p className="mb-4">
                Ao utilizar a Startups AI, o usuário aceita integralmente as
                presentes normas e compromete-se a observá-las, sob o risco de
                aplicação das penalidades cabíveis. A aceitação deste
                instrumento é imprescindível para o acesso e a utilização de
                quaisquer serviços fornecidos pela Startups AI. Caso não
                concorde com as disposições deste instrumento, o usuário não
                deve utilizá-los.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                3. Do Acesso dos Usuários
              </h2>
              <p className="mb-4">
                A Startups AI se compromete a utilizar todas as soluções
                técnicas à disposição para permitir o acesso ao serviço 24
                (vinte e quatro) horas por dia, 7 (sete) dias por semana. No
                entanto, a navegação na plataforma poderá ser interrompida,
                limitada ou suspensa para atualizações, modificações ou qualquer
                ação necessária ao seu bom funcionamento.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                4. Do Cadastro
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                4.1 Requisitos
              </h3>
              <p className="mb-2">
                Para acessar as funcionalidades da plataforma, é necessário
                realizar um cadastro prévio, fornecendo dados completos,
                recentes e válidos. O usuário compromete-se a manter seus dados
                atualizados e verídicos. Menores de 18 anos devem obter
                consentimento de seus responsáveis legais para utilizar a
                plataforma.
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                4.2 Processo de Cadastro
              </h3>
              <p className="mb-4">
                Ao se cadastrar, o usuário deverá informar dados completos,
                recentes e válidos, sendo de sua exclusiva responsabilidade
                manter referidos dados atualizados, bem como o usuário se
                compromete com a veracidade dos dados fornecidos. O usuário
                deverá fornecer um endereço de e-mail válido, através do qual a
                plataforma realizará todas as comunicações necessárias. Após a
                confirmação do cadastro, o usuário possuirá um login e uma senha
                pessoal, que assegura ao usuário o acesso individual à
                plataforma. Desta forma, compete ao usuário exclusivamente a
                manutenção de referida senha de maneira confidencial e segura,
                evitando o acesso indevido às informações pessoais.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                5. Dos Serviços
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                5.1 Descrição dos Serviços
              </h3>
              <p className="mb-2">
                A Startups AI disponibiliza um conjunto de funcionalidades e
                ferramentas para otimizar o uso dos seus serviços de
                business-matchmaking, incluindo:
              </p>
              <ul className="list-disc pl-5 mb-2">
                <li>Identificação de potenciais clientes para startups.</li>
                <li>Conexão com investidores.</li>
                <li>Estabelecimento de parcerias comerciais.</li>
                <li>Acesso a especialistas em negócios de startups.</li>
              </ul>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                5.2 Utilização dos Serviços
              </h3>
              <p className="mb-4">
                Os serviços oferecidos estão descritos na plataforma com o maior
                grau de exatidão possível. Antes de finalizar a contratação de
                qualquer serviço, o usuário deverá se informar sobre as suas
                especificações e sobre a sua destinação.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                6. Dos Preços
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                6.1 Política de Preços
              </h3>
              <p className="mb-2">
                A Startups AI se reserva no direito de reajustar
                unilateralmente, a qualquer tempo, os valores dos serviços sem
                consulta ou anuência prévia do usuário. Os valores aplicados são
                aqueles que estão em vigor no momento do pedido.
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                6.2 Forma de Pagamento
              </h3>
              <p className="mb-2">
                Na contratação de determinado serviço, a plataforma poderá
                solicitar as informações financeiras do usuário, como CPF,
                endereço de cobrança e dados de cartões. Ao inserir referidos
                dados, o usuário concorda que sejam cobrados, de acordo com a
                forma de pagamento que venha a ser escolhida, os preços então
                vigentes e informados no momento da contratação. Referidos dados
                financeiros poderão ser armazenados para facilitar acessos e
                contratações futuras.
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                6.3 Renovação de Serviços
              </h3>
              <p className="mb-4">
                A contratação dos serviços poderá ser renovada automaticamente
                pela plataforma, independentemente de comunicação ao usuário,
                mediante cobrança periódica da mesma forma de pagamento indicada
                pelo usuário quando da contratação do serviço.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                7. Do Cancelamento
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                7.1 Política de Cancelamento
              </h3>
              <p className="mb-2">
                O usuário poderá cancelar a contratação dos serviços de acordo
                com os termos definidos no momento de sua contratação. Ainda, o
                usuário poderá cancelar os serviços em até 7 (sete) dias após a
                contratação, mediante contato com a plataforma, de acordo com o
                Código de Defesa do Consumidor (Lei nº 8.078/90).
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                7.2 Motivos para Cancelamento
              </h3>
              <p className="mb-4">O serviço poderá ser cancelado por:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>
                  Parte do usuário: nessas condições, os serviços somente
                  cessarão quando concluído o ciclo vigente ao tempo do
                  cancelamento.
                </li>
                <li>
                  Violação dos Termos de Uso: os serviços serão cessados
                  imediatamente.
                </li>
              </ul>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                8. Do Suporte
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                8.1 Contato para Suporte
              </h3>
              <p className="mb-2">
                Em caso de dúvidas, sugestões ou problemas, o usuário pode
                entrar em contato com o suporte através do e-mail
                suporte@startupsai.com.br
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                8.2 Horário de Atendimento
              </h3>
              <p className="mb-4">
                O serviço de atendimento ao usuário estará disponível de segunda
                a sexta-feira, das 9h às 18h.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                9. Das Responsabilidades
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                9.1 Responsabilidades do Usuário
              </h3>
              <p className="mb-2">É de responsabilidade do usuário:</p>
              <ul className="list-disc pl-5 mb-2">
                <li>
                  A correta utilização da plataforma, prezando pela boa
                  convivência e respeito entre os usuários.
                </li>
                <li>
                  O cumprimento das regras dispostas neste Termo e na legislação
                  aplicável.
                </li>
                <li>
                  A proteção dos dados de acesso à sua conta (login e senha).
                </li>
              </ul>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                9.2 Responsabilidades da Plataforma
              </h3>
              <p className="mb-4">É de responsabilidade da Startups AI:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Indicar as características dos serviços oferecidos.</li>
                <li>Informações divulgadas por ela na plataforma.</li>
                <li>
                  Atividades ilícitas praticadas através da sua plataforma.
                </li>
              </ul>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                10. Dos Direitos Autorais
              </h2>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                10.1 Propriedade Intelectual
              </h3>
              <p className="mb-2">
                Os conteúdos e ativos de propriedade intelectual da Startups AI
                são protegidos pelas leis de direitos autorais e de propriedade
                industrial. O uso da plataforma é pessoal e intransferível,
                sendo vedado qualquer uso não autorizado.
              </p>
              <h3 className="text-sm font-semibold mb-1 text-gray-800">
                10.2 Licença de Uso
              </h3>
              <p className="mb-4">
                Este Termo de Uso concede aos usuários uma licença não
                exclusiva, não transferível e não sublicenciável, para acessar e
                fazer uso da plataforma e dos serviços e produtos por ela
                disponibilizados.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                11. Das Sanções
              </h2>
              <p className="mb-4">
                A Startups AI poderá, a qualquer momento, advertir, suspender ou
                cancelar a conta do usuário que violar qualquer dispositivo
                deste Termo ou tiver comportamento fraudulento.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                12. Da Rescisão
              </h2>
              <p className="mb-4">
                A não observância das obrigações pactuadas neste Termo poderá
                ensejar a imediata rescisão unilateral por parte da Startups AI
                e o bloqueio de todos os serviços prestados ao usuário.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                13. Das Alterações
              </h2>
              <p className="mb-4">
                Os itens descritos neste instrumento poderão sofrer alterações
                unilateralmente e a qualquer tempo pela Startups AI. As
                alterações serão informadas na plataforma, cabendo ao usuário
                optar por aceitar o novo conteúdo ou cancelar o uso dos
                serviços.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                14. Da Política de Privacidade
              </h2>
              <p className="mb-4">
                O usuário deve consentir com as disposições contidas na Política
                de Privacidade da Startups AI.
              </p>

              <h2 className="text-base font-semibold mb-2 text-gray-800">
                15. Do Foro
              </h2>
              <p className="mb-4">
                Para a solução de controvérsias decorrentes deste instrumento,
                será aplicado integralmente o Direito brasileiro. Os eventuais
                litígios deverão ser apresentados no foro da comarca onde se
                encontra a sede da empresa.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 bg-gray-100 rounded-b-lg">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-white text-gray-700 border border-gray-300 font-medium px-4 py-2 rounded-md hover:bg-gray-50"
            >
              FECHAR
            </Button>
            <Button
              onClick={() => {
                onAgree();
                setIsOpen(false);
              }}
              disabled={!canAgree}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              CONCORDAR
            </Button>
          </div>
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

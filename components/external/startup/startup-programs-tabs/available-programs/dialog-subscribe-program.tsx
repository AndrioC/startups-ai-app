import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { ProgramTable } from "@/app/api/programs/[organization_id]/load-available-programs/route";
import TextMarkdown from "@/components/text-markdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface Props {
  program: ProgramTable;
}

interface EligibilityData {
  is_eligible: boolean;
  justification_eligibility: string;
  generated_edital_analysis: string;
  already_subscribed: boolean;
}

export default function StartupProgramModal({ program }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const startDate = new Date(program.startDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const endDate = new Date(program.endDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const startupId = session?.user?.actor_id;

  const {
    isLoading: isCheckingEligibility,
    error,
    data,
    refetch,
  } = useQuery<{ data: EligibilityData }>({
    queryKey: ["check-eligibility", startupId, program.id],
    queryFn: async () => {
      const response = await axios.post<{ data: EligibilityData }>(
        `/api/startup/check-program-eligibility`,
        {
          params: {
            startup_id: startupId,
            program_id: program.id,
            program_edital: program.editalFileUrl,
          },
        }
      );
      return response.data;
    },
    enabled: false,
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      refetch();
    }
  };

  const handleSubscribeProgram = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/startup/subscribe-program", {
        startup_id: startupId,
        program_id: program.id,
      });

      if (response.status === 200) {
        toast.success("Inscrição realizada com sucesso!", {
          autoClose: 2000,
          position: "top-center",
        });

        refetch();
      } else {
        toast.error("Erro na inscrição!", {
          autoClose: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Erro ao realizar inscrição:", error);
      toast.error("Erro na inscrição!", {
        autoClose: 5000,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editalAnalysis = React.useMemo(() => {
    return data?.data?.generated_edital_analysis ?? null;
  }, [data]);

  const isEnrolled = data?.data?.already_subscribed;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() => handleOpenChange(true)}
          className="bg-white text-blue-600 border border-blue-600 shadow uppercase hover:bg-blue-50 transition-colors duration-300 ease-in-out"
        >
          VER ELEGIBILIDADE
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[950px] bg-[#F5F7FA] h-[90vh] overflow-hidden flex flex-col"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-base font-medium text-[#747D8C]">
            Inscreva-se no programa abaixo e aproveite esta grande oportunidade
          </DialogTitle>
        </DialogHeader>
        <Separator className="w-full flex-shrink-0" />
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {isCheckingEligibility ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#2292EA]" />
              <span className="ml-2 text-[#2292EA]">
                Verificando elegibilidade...
              </span>
            </div>
          ) : error ? (
            <div className="text-red-500">
              Erro ao verificar elegibilidade. Por favor, tente novamente.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <Image
                  src={program.organization.logo_img_url}
                  alt={`${program.organization.name}-logo`}
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  className={`whitespace-nowrap bg-[#FFFCF9] text-[#747D8C] border-2 px-6 py-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    data?.data?.is_eligible
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                >
                  <Sparkles
                    size={20}
                    className={
                      data?.data?.is_eligible
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  {data?.data?.is_eligible
                    ? "Sua Startup está elegível para este programa"
                    : "Sua Startup não está elegível para este programa"}
                </Button>
              </div>
              {!data?.data?.is_eligible &&
                data?.data?.justification_eligibility && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Motivo da inelegibilidade</AlertTitle>
                    <AlertDescription>
                      {data.data.justification_eligibility}
                    </AlertDescription>
                  </Alert>
                )}
              {data?.data?.already_subscribed && (
                <Alert
                  variant="default"
                  className="bg-green-100 border-green-300 text-green-800"
                >
                  <div className="flex">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-3 flex-shrink-0" />
                    <div className="flex flex-col mt-1">
                      <AlertTitle className="text-green-800 font-semibold">
                        Já inscrito
                      </AlertTitle>
                      <AlertDescription className="text-green-700">
                        Sua startup já está inscrita neste programa.
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
              <div className="flex items-center w-full font-medium text-[#747D8C] text-base gap-10">
                <h3>{program.organization.name}</h3>
                <p>
                  Inscrições de {startDate} a {endDate}
                </p>
              </div>
              <div className="text-[#747D8C] text-base">
                <h4 className="font-semibold mb-2">Descrição do programa</h4>
                <p className="text-sm text-justify leading-relaxed">
                  {program.description}
                </p>
              </div>
              <Separator className="w-full" />
              <div className="text-[#747D8C] text-base">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-500" />
                    <h4 className="font-semibold">
                      Principais tópicos do Edital
                    </h4>
                  </div>
                  {program.editalFileUrl ? (
                    <a
                      href={program.editalFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Leia o Edital deste programa
                    </a>
                  ) : (
                    <span className="text-sm text-red-500 font-bold">
                      Edital não disponível
                    </span>
                  )}
                </div>
                {editalAnalysis && (
                  <div className="mt-4">
                    <TextMarkdown text={editalAnalysis} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {!isCheckingEligibility && !error && (
          <div className="flex justify-end items-center p-4">
            <Button
              type="submit"
              variant="blue"
              disabled={!data?.data?.is_eligible || isEnrolled || isLoading}
              onClick={handleSubscribeProgram}
              className={`text-white font-medium uppercase text-[15px] rounded-[30px] w-[200px] h-[40px] shadow-xl transition-colors duration-300 ease-in-out ${
                data?.data?.is_eligible && !isEnrolled
                  ? "bg-[#2292EA] hover:bg-[#3686c3]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEnrolled ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  INSCRITO
                </div>
              ) : (
                "INSCREVER AGORA"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

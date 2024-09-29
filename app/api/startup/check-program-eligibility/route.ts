import { NextRequest, NextResponse } from "next/server";

import { generateM2MToken } from "@/actions/cogtech-api-generate-token";
import { urlToBase64 } from "@/extras/utils";
import prisma from "@/prisma/client";

export const maxDuration = 60;

interface OtherQuestions {
  duracao_do_edital: string;
  etapas_do_edital: string;
  quantidade_de_vagas: string;
  criterio_de_eligibilidade: string;
  formato_de_avaliacao_do_edital: string;
}

interface EditalAnalysisData {
  resumo_edital: string;
  explicacao_edital: string;
  data_publicacao: string;
  data_encerramento: string;
  valor_total: string;
  objetivo_edital: string;
  publico_alvo: string;
  criterios_avaliacao: string;
  documentos_necessarios: string;
  criterios_eligibilidade: string;
  consideracoes_importantes: string;
  outras_perguntas: OtherQuestions;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const startup_id = body.params.startup_id;
  const program_id = body.params.program_id;
  const program_edital = body.params.program_edital;
  const language = "português";

  if (!startup_id || !program_id) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const existingSubscription = await prisma.startup_programs.findUnique({
      where: {
        startup_id_program_id: {
          startup_id: Number(startup_id),
          program_id: Number(program_id),
        },
      },
    });

    const alreadySubscribed = !!existingSubscription;

    const existingEligibility =
      await prisma.startup_program_eligibility.findUnique({
        where: {
          startup_id_program_id: {
            startup_id: Number(startup_id),
            program_id: Number(program_id),
          },
        },
      });

    if (existingEligibility) {
      return NextResponse.json({
        status: 200,
        data: {
          generated_edital_analysis:
            existingEligibility.generated_edital_analysis,
          is_eligible: existingEligibility.is_eligible,
          justification_eligibility:
            existingEligibility.justification_eligibility,
          already_subscribed: alreadySubscribed,
        },
        message: "Dados de elegibilidade existentes recuperados.",
      });
    }

    if (!program_edital) {
      const newEligibility = await prisma.startup_program_eligibility.create({
        data: {
          startup_id: Number(startup_id),
          program_id: Number(program_id),
          is_eligible: true,
          justification_eligibility: "Sem edital para analisar",
          generated_edital_analysis: "Sem edital para analisar",
        },
      });

      return NextResponse.json({
        status: 200,
        data: {
          generated_edital_analysis: newEligibility.generated_edital_analysis,
          is_eligible: newEligibility.is_eligible,
          justification_eligibility: newEligibility.justification_eligibility,
          already_subscribed: alreadySubscribed,
        },
        message: "Elegibilidade definida sem análise de edital.",
      });
    }

    const fileBase64 = await urlToBase64(program_edital);
    const editalQuestions =
      "objetivo do edital? \nduracao do edital? \netapas do edital? \nquantidade de vagas? \nqual e o criterio de elegibilidade? \nqual e o formato de avaliacao do edital?";

    const url = new URL(
      "https://api.questbot.cogtech.com.br/api/sgl/analisar_edital"
    );

    const urlEligibility = new URL(
      "https://api.questbot.cogtech.com.br/api/sgl/analisar_edital_startup"
    );
    const { token } = await generateM2MToken();

    const data = {
      idioma: language,
      descricao: `analise de edital programa - ${program_id}`,
      arquivo_base64: fileBase64,
      codigo_startup: String(startup_id),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        perguntas: editalQuestions,
      }),
    });

    const responseEligibility = await fetch(urlEligibility, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok || !responseEligibility.ok) {
      const errorData = await response.json();
      console.error("erro detalhado:", errorData);
      return NextResponse.json(
        {
          error: "Ocorreu um erro ao analisar o edital",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    const responseJSON = JSON.parse(responseData) as EditalAnalysisData;
    const formattedAnalysis = formatEditalAnalysis(responseJSON);

    const responseEligibilityData = await responseEligibility.json();
    const responseEligibilityDataJSON = JSON.parse(responseEligibilityData) as {
      status_elegebilidade: string;
      justificativa_elegibilidade: string;
    };

    const isEligible =
      responseEligibilityDataJSON.status_elegebilidade !== "NÃO";

    const newEligibility = await prisma.startup_program_eligibility.create({
      data: {
        startup_id: Number(startup_id),
        program_id: Number(program_id),
        is_eligible: isEligible,
        justification_eligibility:
          responseEligibilityDataJSON.justificativa_elegibilidade,
        generated_edital_analysis: formattedAnalysis,
      },
    });

    return NextResponse.json({
      status: 200,
      data: {
        generated_edital_analysis: newEligibility.generated_edital_analysis,
        is_eligible: newEligibility.is_eligible,
        justification_eligibility: newEligibility.justification_eligibility,
        already_subscribed: alreadySubscribed,
      },
      message: "Análise de edital concluída e salva com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}

function formatEditalAnalysis(data: EditalAnalysisData): string {
  return `**1. Objetivo:** ${data.objetivo_edital || "Informação não disponível"}
  
  **2. Duração:** ${data.outras_perguntas.duracao_do_edital || "Informação não disponível"}
  
  **3. Etapas:** ${data.outras_perguntas.etapas_do_edital || "Informação não disponível"}
  
  **4. Vagas:** ${data.outras_perguntas.quantidade_de_vagas || "Informação não disponível"}
  
  **5. Critérios de elegibilidade:** ${data.outras_perguntas.criterio_de_eligibilidade || "Informação não disponível"}
  
  **6. Avaliação:** ${data.outras_perguntas.formato_de_avaliacao_do_edital || "Informação não disponível"}
  
  **7. Informações Adicionais:**
  - **Resumo do Edital:** ${data.resumo_edital || "Informação não disponível"}
  - **Explicação do Edital:** ${data.explicacao_edital || "Informação não disponível"}
  - **Data de Publicação:** ${data.data_publicacao || "Informação não disponível"}
  - **Data de Encerramento:** ${data.data_encerramento || "Informação não disponível"}
  - **Valor Total:** ${data.valor_total || "Informação não disponível"}
  - **Público Alvo:** ${data.publico_alvo || "Informação não disponível"}
  - **Critérios de Avaliação:** ${data.criterios_avaliacao || "Informação não disponível"}
  - **Documentos Necessários:** ${data.documentos_necessarios || "Informação não disponível"}
  - **Considerações Importantes:** ${data.consideracoes_importantes || "Informação não disponível"}`;
}

import { NextRequest, NextResponse } from "next/server";

import { generateM2MToken } from "@/actions/cogtech-api-generate-token";
import prisma from "@/prisma/client";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const startup_id = body.params.startup_id;
  const language = "português";

  if (!startup_id) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const url = new URL(
    "https://api.questbot.cogtech.com.br/api/sgl/gerar_perfil_startup"
  );
  url.searchParams.append("codigo_startup", startup_id.toString());
  url.searchParams.append("idioma", language);

  try {
    const { token } = await generateM2MToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("erro detalhado:", errorData);
      return NextResponse.json(
        {
          error: "Ocorreu um erro ao iniciar a geração do perfil",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    await prisma.startup_generated_profiles.updateMany({
      where: {
        startup_id: Number(startup_id),
        active: true,
      },
      data: {
        active: false,
      },
    });

    const currentDate = new Date();

    const newProfile = await prisma.startup_generated_profiles.create({
      data: {
        startup_id: Number(startup_id),
        profile: data,
        active: true,
        generated_date: currentDate,
      },
    });

    return NextResponse.json({
      status: 200,
      data: data,
      message: "Perfil gerado com sucesso!",
      newProfileId: newProfile.id,
    });
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}

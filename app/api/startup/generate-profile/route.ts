import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const codigo_startup = body.params.codigo_startup;
  const idioma = "português";

  if (!codigo_startup) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const url = new URL(
    "https://api.questbot.cogtech.com.br/api/sgl/gerar_perfil_startup"
  );
  url.searchParams.append("codigo_startup", codigo_startup.toString());
  url.searchParams.append("idioma", idioma);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro detalhado:", errorData);
      return NextResponse.json(
        {
          error: "Ocorreu um erro ao iniciar a geração do perfil",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    try {
      await prisma.startup_generated_profiles.updateMany({
        where: {
          startup_id: Number(codigo_startup),
          active: true,
        },
        data: {
          active: false,
        },
      });

      const currentDate = new Date();
      const dateWithoutTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      const newProfile = await prisma.startup_generated_profiles.create({
        data: {
          startup_id: Number(codigo_startup),
          profile: data,
          active: true,
          generated_date: dateWithoutTime,
        },
      });

      return NextResponse.json({
        status: 200,
        data: data,
        message: "Perfil gerado com sucesso!",
        newProfileId: newProfile.id,
      });
    } catch (dbError) {
      console.error("Error updating database:", dbError);
      return NextResponse.json(
        {
          error:
            "Perfil gerado, mas ocorreu um erro ao atualizar o banco de dados",
          details: dbError,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao iniciar geração de perfil:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao iniciar a geração do perfil" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

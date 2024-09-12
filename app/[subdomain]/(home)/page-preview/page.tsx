"use client";

import { useSearchParams } from "next/navigation";

import { PreviewComponent } from "@/components/pages/settings/external-page/external-page-preview";

export default function ExternalPagePreview() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("data");

  if (!encodedData) {
    return <div>Dados de pré-visualização não encontrados.</div>;
  }

  try {
    const decodedData = JSON.parse(decodeURIComponent(encodedData));
    return <PreviewComponent {...decodedData} />;
  } catch (error) {
    console.error("Erro ao decodificar os dados:", error);
    return <div>Erro ao carregar a pré-visualização.</div>;
  }
}

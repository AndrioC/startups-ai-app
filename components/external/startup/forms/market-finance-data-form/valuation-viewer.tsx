import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Valuation {
  id: string;
  name: string;
  createdAt: string;
  value: string;
}

interface Props {
  valuation: Valuation;
  onBack: () => void;
}

export default function ValuationViewer({ valuation, onBack }: Props) {
  return (
    <div className="space-y-4">
      <Button
        onClick={onBack}
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="border p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">{valuation.name}</h2>
        <p>Data de criação: {valuation.createdAt}</p>
        <p>Valor: {valuation.value}</p>
        <p className="mt-4">Detalhes do Valuation mockado aqui...</p>
      </div>
    </div>
  );
}

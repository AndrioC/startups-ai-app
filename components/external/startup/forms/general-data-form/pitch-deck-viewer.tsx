import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Pitchdeck {
  id: string;
  name: string;
  createdAt: string;
}

interface Props {
  pitchdeck: Pitchdeck;
  onBack: () => void;
}

export default function PitchdeckViewer({ pitchdeck, onBack }: Props) {
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
        <h2 className="text-xl font-bold mb-2">{pitchdeck.name}</h2>
        <p>Data de criação: {pitchdeck.createdAt}</p>
        <p className="mt-4">Conteúdo do Pitchdeck mockado aqui...</p>
      </div>
    </div>
  );
}

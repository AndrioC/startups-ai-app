import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

interface Props {
  profile: Profile;
  onBack: () => void;
}

export default function ProfileViewer({ profile, onBack }: Props) {
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
        <h2 className="text-xl font-bold mb-2">{profile.name}</h2>
        <p>Data de criação: {profile.createdAt}</p>
        <p className="mt-4">Conteúdo do Perfil mockado aqui...</p>
      </div>
    </div>
  );
}

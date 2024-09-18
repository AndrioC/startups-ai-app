import React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Profile } from "@/contexts/FormStartupContext";

import StartupProfileMarkDown from "./startup-profile-markdown";

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
        <StartupProfileMarkDown profileData={profile.profile} />
      </div>
    </div>
  );
}

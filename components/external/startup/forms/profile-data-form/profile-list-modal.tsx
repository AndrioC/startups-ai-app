import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ProfileViewer from "./profile-viewer";

interface Profile {
  id: string;
  name: string;
  createdAt: string;
}

const mockProfiles: Profile[] = [
  { id: "1", name: "Perfil 1", createdAt: "10/03/2024" },
  { id: "2", name: "Perfil 2", createdAt: "11/03/2024" },
  { id: "3", name: "Perfil 3", createdAt: "12/03/2024" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileListModal({ isOpen, onClose }: Props) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBack = () => {
    setSelectedProfile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedProfile ? "Visualizar Perfil" : "Perfis Gerados"}
          </DialogTitle>
        </DialogHeader>
        {selectedProfile ? (
          <ProfileViewer profile={selectedProfile} onBack={handleBack} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProfiles.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleProfileClick(profile)}
                >
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Profile,
  useFormStartupDataState,
} from "@/contexts/FormStartupContext";

import ProfileViewer from "./profile-viewer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileListModal({ isOpen, onClose }: Props) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingProfileId, setUpdatingProfileId] = useState<number | null>(
    null
  );

  const { initialData, refetch } = useFormStartupDataState();

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const handleBack = () => {
    setSelectedProfile(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleActivate = async (profile: Profile) => {
    setIsLoading(true);
    setUpdatingProfileId(profile.id);
    try {
      const response = await axios.patch(
        `/api/startup/update-startup-active-profile/${profile?.startup_id}`,
        JSON.stringify({
          profile_id: profile?.id,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Perfil ativado com sucesso!");
        await refetch();
      } else {
        toast.error("Erro ao ativar o perfil. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao ativar o perfil. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
      setUpdatingProfileId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col overflow-y-auto">
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
                <TableHead>Ordem</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.allGeneratedProfiles.map((profile) => (
                <TableRow key={profile.id} className="hover:bg-gray-100">
                  <TableCell>{profile.profile_number}</TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleProfileClick(profile)}
                  >
                    {formatDate(profile.generated_date)}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleProfileClick(profile)}
                  >
                    {profile.active ? "Ativo" : "Inativo"}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivate(profile);
                      }}
                      disabled={
                        profile.active ||
                        isLoading ||
                        updatingProfileId === profile.id
                      }
                      className={`${
                        profile.active ||
                        isLoading ||
                        updatingProfileId === profile.id
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      } px-4 py-2 rounded flex items-center justify-center`}
                    >
                      {updatingProfileId === profile.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Ativando...
                        </>
                      ) : (
                        "Ativar"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

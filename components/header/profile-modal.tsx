import React, { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { InputAttachment } from "@/components/header/input-attachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useRefreshAuth } from "../../hooks/useRefreshAuth";

import "react-image-crop/dist/ReactCrop.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  avatarUrl: string;
  userId: string;
  organizationId: number;
  onUpdateProfile: (name: string, avatarUrl: string) => void;
}

function getInitials(name: string): string {
  if (!name) {
    return "N/A";
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

export default function ProfileModal({
  isOpen,
  onClose,
  userName: initialUserName,
  avatarUrl,
  userId,
  organizationId,
  onUpdateProfile,
}: ProfileModalProps) {
  const { refreshAuthData } = useRefreshAuth();
  const [userName, setUserName] = useState(initialUserName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setNameError(e.target.value.trim() ? null : "O nome é obrigatório");
  };

  const handleAvatarChange = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImage(e.target?.result as string);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCrop = async () => {
    if (imageRef.current && completedCrop) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        completedCrop
      );
      const croppedImageFile = dataURLToFile(croppedImageUrl, "avatar.png");
      setAvatarFile(croppedImageFile);
      setAvatarPreview(croppedImageUrl);
      setShowCrop(false);
      setCropImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setNameError("O nome é obrigatório");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", userName);
      if (avatarFile) {
        formData.append("file", avatarFile);
      }

      const response = await axios.post(
        `/api/profile/${organizationId}/update-profile?user_id=${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onUpdateProfile(response.data.name, response.data.logo_img);
      toast.success("Perfil atualizado com sucesso!");

      await refreshAuthData();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar o perfil. Por favor, tente novamente.");
    }
    setIsUploading(false);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, 1));
      imageRef.current = e.currentTarget;
    },
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <Avatar className="w-full h-full border-2 border-dashed border-gray-300">
                  {avatarPreview ? (
                    <>
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </>
                  ) : (
                    <AvatarFallback className="text-4xl bg-gray-100">
                      {getInitials(userName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <InputAttachment
                  id="avatar"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(file) => handleAvatarChange(file)}
                />
              </div>
            </div>
            <Input
              id="name"
              value={userName}
              onChange={handleNameChange}
              placeholder="Nome"
              className={`w-full text-center text-lg ${nameError ? "border-red-500" : ""}`}
            />
            {nameError && (
              <p className="text-red-500 text-xs text-center mt-1">
                {nameError}
              </p>
            )}
          </div>
          <Button
            variant="blue"
            type="submit"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </form>
      </DialogContent>
      {showCrop && cropImage && (
        <Dialog open={showCrop} onOpenChange={() => setShowCrop(false)}>
          <DialogContent className="sm:max-w-[600px] w-[600px] h-[600px] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-center">Recortar Imagem</DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-auto flex justify-center items-center">
              <div className="relative w-full h-full">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    src={cropImage}
                    alt="Crop"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowCrop(false)}>
                Cancelar
              </Button>
              <Button variant="blue" onClick={handleConfirmCrop}>
                Confirmar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}

function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      },
      "image/png",
      1
    );
  });
}

function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, X, XSquare } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRefreshAuth } from "@/hooks/useRefreshAuth";

import "react-image-crop/dist/ReactCrop.css";

const tabs = [
  { id: "general", title: "Geral" },
  { id: "external-page", title: "Página externa" },
];

interface ImageError {
  file: File;
  message: string;
}

const getCroppedImg = (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

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
        XSquare;
        const file = new File([blob], fileName, { type: "image/png" });
        resolve(file);
      },
      "image/png",
      1
    );
  });
};

const verifyImageSize = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

export default function SettingsComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const organizationId = session?.user?.organization_id;
  const { refreshAuthData } = useRefreshAuth();

  const tabQuery = searchParams.get("tab");
  const defaultTab = "general";
  const isValidTab = tabs.some((tab) => tab.id === tabQuery);
  const initialTab = isValidTab ? tabQuery : defaultTab;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isUploading, setIsUploading] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const logoSidebarInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoSidebarPreview, setLogoSidebarPreview] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<ImageError[]>([]);
  const [showCrop, setShowCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState<"logo" | "logoSidebar" | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 300,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (session?.user?.logo_img) {
      setLogoPreview(session.user.logo_img);
    }
    if (session?.user?.logo_sidebar) {
      setLogoSidebarPreview(session.user.logo_sidebar);
    }
  }, [session]);

  const removeError = (errorToRemove: ImageError) => {
    setErrors(errors.filter((error) => error !== errorToRemove));
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`);
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "logoSidebar"
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const { width, height } = await verifyImageSize(file);
        const minWidth = type === "logo" ? 300 : 50;
        const minHeight = type === "logo" ? 100 : 50;
        const maxWidth = type === "logo" ? 600 : 200;
        const maxHeight = type === "logo" ? 500 : 200;

        if (file.size > 2 * 1024 * 1024) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: "O tamanho do arquivo excede o limite de 2MB.",
            },
          ]);
        } else if (width < minWidth || height < minHeight) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: `A imagem é muito pequena. Tamanho mínimo requerido: ${minWidth}x${minHeight} pixels. Tamanho atual: ${width}x${height} pixels.`,
            },
          ]);
        } else if (width > maxWidth || height > maxHeight) {
          setErrors((prev) => [
            ...prev,
            {
              file,
              message: `A imagem é muito grande. Tamanho máximo permitido: ${maxWidth}x${maxHeight} pixels. Tamanho atual: ${width}x${height} pixels.`,
            },
          ]);
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setCropImage(reader.result as string);
            setCropType(type);
            setCrop({
              unit: "px",
              width: type === "logo" ? 300 : 50,
              height: type === "logo" ? 100 : 50,
              x: 0,
              y: 0,
            });
            setImageDimensions({ width, height });
            setShowCrop(true);
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error("Error verifying image size:", error);
        setErrors((prev) => [
          ...prev,
          {
            file,
            message:
              "Erro ao verificar o tamanho da imagem. Por favor, tente novamente.",
          },
        ]);
      }
    }
    event.target.value = "";
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(event, "logo");
  };

  const handleLogoSidebarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleImageChange(event, "logoSidebar");
  };

  const uploadImage = async (file: File, type: "logo" | "logoSidebar") => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint =
        type === "logo"
          ? `/api/settings/${organizationId}/upload-logo`
          : `/api/settings/${organizationId}/upload-sidebar-logo`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`${type} upload successful:`, response.data);
      toast.success(
        `${type === "logo" ? "Logo" : "Logo da sidebar"} atualizado com sucesso!`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );

      await refreshAuthData();

      return response.data.fileName;
    } catch (error) {
      console.error(`${type} upload failed:`, error);
      toast.error(
        `Erro ao enviar ${type === "logo" ? "o logo" : "o logo da sidebar"}. Por favor, tente novamente.`,
        {
          autoClose: 3000,
          position: "top-center",
        }
      );
      throw error;
    }
  };

  const handleConfirmCrop = async () => {
    if (cropImage && cropType) {
      setIsUploading(true);
      try {
        const img = document.createElement("img");
        img.src = cropImage;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        let imageToUpload: File;

        if (completedCrop) {
          imageToUpload = await getCroppedImg(
            img,
            completedCrop,
            cropType === "logo" ? "logo.png" : "logo-sidebar.png"
          );
        } else {
          const response = await fetch(cropImage);
          const blob = await response.blob();
          imageToUpload = new File(
            [blob],
            cropType === "logo" ? "logo.png" : "logo-sidebar.png",
            { type: blob.type }
          );
        }

        await uploadImage(imageToUpload, cropType);

        if (cropType === "logo") {
          setLogoPreview(URL.createObjectURL(imageToUpload));
        } else {
          setLogoSidebarPreview(URL.createObjectURL(imageToUpload));
        }

        handleCloseCropModal();
      } catch (error) {
        console.log("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCloseCropModal = () => {
    setShowCrop(false);
    setCropImage(null);
    setCropType(null);
    setCompletedCrop(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    if (logoSidebarInputRef.current) logoSidebarInputRef.current.value = "";
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col relative w-full">
        <div className="flex overflow-x-auto whitespace-nowrap border-b">
          {tabs.map((tab, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm sm:text-base ${
                  activeTab === tab.id ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {tab.title}
              </button>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-400"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex-grow p-4 sm:p-5 overflow-y-auto">
          <div className="w-full">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg w-[320px] h-[120px] flex items-center justify-center cursor-pointer">
                    <div className="relative w-[300px] h-[100px]">
                      <Input
                        type="file"
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="logo-upload"
                        ref={logoInputRef}
                      />
                      {logoPreview ? (
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          layout="fill"
                          objectFit="contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                          Escolher arquivo (300 x 100)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo sidebar
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg w-[60px] h-[60px] flex items-center justify-center cursor-pointer">
                    <div className="relative w-[50px] h-[50px]">
                      <Input
                        type="file"
                        onChange={handleLogoSidebarChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="logo-sidebar-upload"
                        ref={logoSidebarInputRef}
                      />
                      {logoSidebarPreview ? (
                        <Image
                          src={logoSidebarPreview}
                          alt="Logo sidebar preview"
                          layout="fill"
                          objectFit="contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-xs cursor-pointer">
                          50 x 50
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="space-y-2">
                    {errors.map((error, index) => (
                      <Alert
                        key={index}
                        variant="destructive"
                        className="relative"
                      >
                        <AlertTitle>Erro de imagem</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                        <button
                          onClick={() => removeError(error)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-300 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Fechar</span>
                        </button>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "external-page" && (
              <p>Conteúdo da página externa aqui</p>
            )}
          </div>
        </div>

        {showCrop && cropImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
              <h2 className="text-2xl font-bold mb-4">Cortar Imagem</h2>
              <div className="mb-4 relative">
                <div
                  className="absolute border-2 border-dashed border-red-500 pointer-events-none"
                  style={{
                    width: `${imageDimensions.width}px`,
                    height: `${imageDimensions.height}px`,
                    maxWidth: "100%",
                    maxHeight: "60vh",
                  }}
                ></div>
                <div className="overflow-auto max-h-[60vh]">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={cropType === "logo" ? 3 : 1}
                    minWidth={cropType === "logo" ? 300 : 50}
                    minHeight={cropType === "logo" ? 100 : 50}
                    maxWidth={cropType === "logo" ? 300 : 50}
                    maxHeight={cropType === "logo" ? 100 : 50}
                  >
                    <img
                      src={cropImage}
                      alt="Crop"
                      style={{ maxWidth: "100%", maxHeight: "60vh" }}
                    />
                  </ReactCrop>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {cropType === "logo"
                    ? "Tamanho exato: 300x100"
                    : "Tamanho exato: 50x50"}
                </p>
                <div className="flex justify-end gap-4">
                  <Button onClick={handleCloseCropModal} variant="secondary">
                    Cancelar
                  </Button>
                  <Button
                    variant="blue"
                    onClick={handleConfirmCrop}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

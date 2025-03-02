"use client";

import { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { toast } from "react-toastify";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import "react-image-crop/dist/ReactCrop.css";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  imageToCrop: string | null;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

function centerAspectCrop(imgWidth: number, imgHeight: number) {
  const size = Math.min(imgWidth, imgHeight) * 0.9;
  const x = (imgWidth - size) / 2;
  const y = (imgHeight - size) / 2;

  return {
    unit: "px",
    width: size,
    height: size,
    x: x,
    y: y,
  } as PixelCrop;
}

export default function ImageCropDialog({
  isOpen,
  setIsOpen,
  imageToCrop,
  onCropComplete,
}: Props) {
  const t = useTranslations("cropImage");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageValid, setIsImageValid] = useState(false);

  useEffect(() => {
    if (imageToCrop) {
      const img = new Image();
      img.onload = () => {
        if (img.width > 600 || img.height > 600) {
          toast.error(t("imageTooBig"));
          setIsOpen(false);
          setIsImageValid(false);
        } else {
          setIsImageValid(true);
          const initialCrop = centerAspectCrop(img.width, img.height);
          setCrop(initialCrop);
          setCompletedCrop(initialCrop);
        }
      };
      img.src = imageToCrop;
    }
  }, [imageToCrop, setIsOpen, t]);

  const handleCropComplete = () => {
    if (completedCrop && imageRef.current) {
      const image = imageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        completedCrop.x,
        completedCrop.y,
        completedCrop.width,
        completedCrop.height,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
            setIsOpen(false);
          }
        },
        "image/png",
        1
      );
    }
  };

  if (!isImageValid) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg focus:outline-none">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800">
              {t("title")}
            </Dialog.Title>
            <div className="flex justify-center items-center">
              {imageToCrop && isImageValid && (
                <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    className="max-w-[300px]"
                  >
                    <img
                      ref={imageRef}
                      src={imageToCrop}
                      alt="Imagem para recortar"
                      className="max-w-[300px] max-h-[300px] object-contain"
                      style={{ maxWidth: "100%" }}
                    />
                  </ReactCrop>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 bg-gray-100 rounded-b-lg">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-white text-gray-700 border border-gray-300 font-medium px-4 py-2 rounded-md hover:bg-gray-50"
            >
              {t("cancelButton")}
            </Button>
            <Button
              onClick={handleCropComplete}
              disabled={!completedCrop?.width || !completedCrop?.height}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {t("saveButton")}
            </Button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <Cross2Icon className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

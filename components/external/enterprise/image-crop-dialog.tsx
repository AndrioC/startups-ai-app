"use client";

import { useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import "react-image-crop/dist/ReactCrop.css";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  imageToCrop: string | null;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

export default function ImageCropDialog({
  isOpen,
  setIsOpen,
  imageToCrop,
  onCropComplete,
}: Props) {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCropComplete = () => {
    if (crop && imageRef.current) {
      const image = imageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = crop.width * scaleX * pixelRatio;
      canvas.height = crop.height * scaleY * pixelRatio;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[90vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-lg focus:outline-none">
          <div className="p-6">
            <Dialog.Title className="text-lg font-semibold mb-4 text-gray-800">
              Recortar Imagem
            </Dialog.Title>
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
              {imageToCrop && (
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    ref={imageRef}
                    src={imageToCrop}
                    alt="Imagem para recortar"
                  />
                </ReactCrop>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 bg-gray-100 rounded-b-lg">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="bg-white text-gray-700 border border-gray-300 font-medium px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCropComplete}
              className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Concluir
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

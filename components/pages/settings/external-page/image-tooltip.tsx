import React from "react";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ImageTooltipProps {
  children: React.ReactNode;
  image: string;
  alt: string;
  width: number;
  height: number;
}

export function ImageTooltip({
  children,
  image,
  alt,
  width,
  height,
}: ImageTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="center"
          className="p-0 overflow-hidden ml-10"
        >
          <Image
            src={image}
            alt={alt}
            width={width}
            height={height}
            className="rounded-md"
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

import { useState } from "react";
import Image from "next/image";

interface LogoImageProps {
  logoUrl: string;
  subdomain: string;
}

export function LogoImage({ logoUrl, subdomain }: LogoImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-[250px] h-[200px]">
      <Image
        src={logoUrl}
        alt={subdomain ? `${subdomain}-logo` : "Logo"}
        layout="fill"
        objectFit="contain"
        onLoadingComplete={() => setIsLoading(false)}
        className={`duration-700 ease-in-out ${
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        }`}
      />
    </div>
  );
}

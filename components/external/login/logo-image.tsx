import Image from "next/image";

interface LogoImageProps {
  logoUrl: string;
  subdomain: string;
}

export function LogoImage({ logoUrl, subdomain }: LogoImageProps) {
  return (
    <Image
      src={logoUrl}
      alt={subdomain ? `${subdomain}-logo` : "Logo"}
      width={250}
      height={250}
      className="mt-[20px] md:mt-[40px] mb-[20px]"
      style={{ objectFit: "contain" }}
    />
  );
}

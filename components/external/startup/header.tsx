import Image from "next/image";

interface HeaderProps {
  logoSrc: string;
  logoAlt: string;
}

export default function HeaderExternalStartupComponent({
  logoSrc,
  logoAlt,
}: HeaderProps) {
  return (
    <header className="w-full bg-[#B4D5EE] rounded-b-lg">
      <div className="max-w-screen-xl flex items-center pl-24">
        <Image src={logoSrc} alt={logoAlt} className="h-20" />
      </div>
    </header>
  );
}

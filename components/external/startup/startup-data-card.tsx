import { FaLocationDot, FaRegUser } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineAddBusiness, MdOutlineMailOutline } from "react-icons/md";
import { RiFolderLockLine } from "react-icons/ri";
import { Language } from "@prisma/client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import brazilFlag from "@/assets/img/brazil-flag.svg";
import placeholder from "@/assets/img/placeholder-sidemenu.svg";
import { FormStartupData } from "@/contexts/FormStartupContext";

interface Props {
  data: Partial<FormStartupData>;
}

export default function StartupDataCard({ data }: Props) {
  const t = useTranslations("startupForm.startupDataCard");
  const { data: session } = useSession();
  const emptyField = t("placeholders.emptyField");

  const verticalText =
    session?.user?.language === Language.PT_BR
      ? data?.verticalText?.name_pt
      : data?.verticalText?.name_en;

  return (
    <div className="w-[300px] bg-[#F1F3F3] shadow-md rounded-lg text-gray-500 flex flex-col">
      <div className="text-xl font-bold p-5 pb-4">{t("title")}</div>
      <div className="flex justify-between px-5 mb-5 w-full">
        <div className="logo-container w-[100px] h-[100px] relative">
          <Image
            src={data.loadLogoUrl || placeholder}
            alt={t("images.startupLogo")}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Image src={brazilFlag} alt="country flag" className="w-8 h-8" />
      </div>
      <ul className="space-y-3 mb-4 font-medium px-5">
        <li className="flex items-center gap-1">
          <HiOutlineBuildingOffice2 size={18} />
          <span className="break-words">{data?.startupName || emptyField}</span>
        </li>
        <li className="flex items-center gap-1">
          <FaLocationDot size={18} />
          <span className="break-words">
            {data?.stateAndCity || emptyField}
          </span>
        </li>
        <li className="flex items-center gap-1">
          <RiFolderLockLine size={18} />
          <span className="break-words">
            {data?.businessModelText || emptyField}
          </span>
        </li>
        <li className="flex items-start gap-1">
          <MdOutlineAddBusiness size={18} className="mt-1" />
          <span className="break-words">{verticalText || emptyField}</span>
        </li>
      </ul>
      <hr className="border-gray-300 mb-4 w-[260px] mx-auto" />
      <div className="font-bold mb-4 px-5">{t("responsibleData")}</div>
      <ul className="space-y-3 mb-4 font-medium px-5">
        <li className="flex items-center gap-1">
          <FaRegUser size={18} />
          <span className="break-words">
            {data?.mainResponsibleName || emptyField}
          </span>
        </li>
        <li className="flex items-center gap-1">
          <MdOutlineMailOutline size={18} />
          <span className="break-words">
            {data?.mainResponsibleEmail || emptyField}
          </span>
        </li>
        <li className="flex items-center gap-1">
          <FiPhone size={18} />
          <span className="break-words">
            {data?.contactNumber || emptyField}
          </span>
        </li>
      </ul>
    </div>
  );
}

import { FaLocationDot, FaRegUser } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import { useTranslations } from "next-intl";

import brazilFlag from "@/assets/img/brazil-flag.svg";
import placeholder from "@/assets/img/placeholder-sidemenu.svg";
import { FormEnterpriseData } from "@/contexts/FormEnterpriseContext";

interface Props {
  data: Partial<FormEnterpriseData>;
}

export default function CompanyDataCard({ data }: Props) {
  const t = useTranslations("sideCard");
  const emptyField = t("companyInfo.placeholders.emptyField");

  return (
    <div className="w-[300px] bg-[#F1F3F3] shadow-md rounded-lg text-gray-500 flex flex-col">
      <div className="text-base font-medium p-5 pb-4 uppercase">
        {t("companyInfo.title")}
      </div>
      <div className="flex justify-between px-5 mb-5 w-full">
        <div className="logo-container w-[100px] h-[100px] relative">
          <Image
            src={data.logoImageUrl || placeholder}
            alt={t("logo")}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Image src={brazilFlag} alt="country flag" className="w-8 h-8" />
      </div>
      <ul className="space-y-3 mb-4 font-medium px-5">
        <li className="flex items-center gap-1">
          <HiOutlineBuildingOffice2 size={18} />
          <span className="break-words">{data?.name || emptyField}</span>
        </li>
        <li className="flex items-center gap-1">
          <FaLocationDot size={18} />
          <span className="break-words">{data?.stateCity || emptyField}</span>
        </li>
      </ul>
      <hr className="border-gray-300 mb-4 w-[260px] mx-auto" />
      <div className="text-base font-medium p-5 pb-4 uppercase">
        {t("companyInfo.responsibleData")}
      </div>
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
            {data?.mainResponsiblePhone || emptyField}
          </span>
        </li>
      </ul>
    </div>
  );
}

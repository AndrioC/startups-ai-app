import { FaLocationDot, FaRegUser } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineMailOutline } from "react-icons/md";
import Image from "next/image";
import { useTranslations } from "next-intl";

import brazilFlag from "@/assets/img/brazil-flag.svg";
import placeholder from "@/assets/img/placeholder-sidemenu.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormEnterpriseData } from "@/contexts/FormEnterpriseContext";

interface Props {
  data: Partial<FormEnterpriseData>;
}

export default function EnterpriseDataCard({ data }: Props) {
  const t = useTranslations("sideCard");
  const emptyField = t("companyInfo.placeholders.emptyField");

  const truncateText = (
    text: string | null | undefined,
    maxLength: number = 20
  ) => {
    if (!text) return emptyField;

    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <TooltipProvider>
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
          <li className="flex items-start gap-3">
            <HiOutlineBuildingOffice2
              className="flex-shrink-0 mt-1"
              size={20}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="break-words flex-1 cursor-help">
                  {truncateText(data?.name)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data?.name || emptyField}</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="flex items-start gap-3">
            <FaLocationDot className="flex-shrink-0 mt-1" size={20} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="break-words flex-1 cursor-help">
                  {truncateText(data?.stateCity)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data?.stateCity || emptyField}</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
        <hr className="border-gray-300 mb-4 w-[260px] mx-auto" />
        <div className="text-base font-medium p-5 pb-4 uppercase">
          {t("companyInfo.responsibleData")}
        </div>
        <ul className="space-y-3 mb-4 font-medium px-5">
          <li className="flex items-start gap-3">
            <FaRegUser className="flex-shrink-0 mt-1" size={20} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="break-words flex-1 cursor-help">
                  {truncateText(data?.mainResponsibleName)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data?.mainResponsibleName || emptyField}</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="flex items-start gap-3">
            <MdOutlineMailOutline className="flex-shrink-0 mt-1" size={20} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="break-words flex-1 cursor-help">
                  {truncateText(data?.mainResponsibleEmail, 20)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data?.mainResponsibleEmail || emptyField}</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="flex items-start gap-3">
            <FiPhone className="flex-shrink-0 mt-1" size={20} />
            <span className="break-words flex-1">
              {data?.mainResponsiblePhone || emptyField}
            </span>
          </li>
        </ul>
      </div>
    </TooltipProvider>
  );
}

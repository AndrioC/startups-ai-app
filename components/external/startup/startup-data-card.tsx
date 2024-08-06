import { FaLocationDot, FaRegUser } from "react-icons/fa6";
import { FiPhone } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineAddBusiness, MdOutlineMailOutline } from "react-icons/md";
import { RiFolderLockLine } from "react-icons/ri";
import Image from "next/image";

import brazilFlag from "@/assets/img/brazil-flag.svg";
import placeholder from "@/assets/img/placeholder-sidemenu.svg";
import { FormStartupData } from "@/contexts/FormStartupContext";

interface Props {
  data: Partial<FormStartupData>;
}

export default function StartupDataCard({ data }: Props) {
  return (
    <div className="w-[300px] h-[600px] bg-[#F1F3F3] shadow-md rounded-lg text-gray-500">
      <div className="text-xl font-bold mb-4 pl-5 mt-5">DADOS DA STARTUP</div>
      <div className="flex justify-between pl-5 pr-5 mb-5 w-[270px] gap-2">
        <div className="logo-container">
          <Image
            src={data.loadLogoUrl || placeholder}
            alt="Startup Logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <Image src={brazilFlag} alt="Brazil Flag" className="w-8 h-8" />
      </div>
      <ul className="space-y-3 mb-4 font-medium pl-5 mt-3">
        <li className="flex items-center gap-1">
          <HiOutlineBuildingOffice2 size={18} />
          {data?.startupName ? data?.startupName : "-"}
        </li>
        <li className="flex items-center gap-1">
          <FaLocationDot size={18} />
          {data?.stateAndCity ? data?.stateAndCity : "-"}
        </li>
        <li className="flex items-center gap-1">
          <RiFolderLockLine size={18} />
          {data?.businessModelText ? data?.businessModelText : "-"}
        </li>
        <li className="flex gap-1">
          <MdOutlineAddBusiness size={18} className="mt-0.5" />
          {data?.verticalText ? data?.verticalText : "-"}
        </li>
      </ul>
      <hr className="border-gray-300 mb-4 w-[260px] mx-auto" />
      <div className="font-bold mb-4 pl-5">DADOS DO RESPONSÁVEL</div>
      <ul className="space-y-3 mb-4 font-medium pl-5 mt-3">
        <li className="flex items-center gap-1">
          <FaRegUser size={18} />
          {data?.mainResponsibleName ? data?.mainResponsibleName : "-"}
        </li>
        <li className="flex items-center gap-1">
          <MdOutlineMailOutline size={18} />
          {data?.mainResponsibleEmail ? data?.mainResponsibleEmail : "-"}
        </li>
        <li className="flex items-center gap-1">
          <FiPhone size={18} />
          {data?.contactNumber ? data?.contactNumber : "-"}
        </li>
      </ul>
    </div>
  );
}

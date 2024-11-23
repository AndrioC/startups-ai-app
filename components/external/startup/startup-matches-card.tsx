import { AiOutlineWarning } from "react-icons/ai";
import { FaDollarSign } from "react-icons/fa";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Image from "next/image";
import { useTranslations } from "next-intl";

import arrowMatches from "@/assets/img/arrow-matches.svg";

const matches = [
  {
    icon: <FaDollarSign color="#A5B5C1" size={18} />,
    text: "88% - 12/04/2024",
  },
  { icon: <LuUsers2 color="#A5B5C1" size={18} />, text: "94% - 12/04/2024" },
  {
    icon: <MdOutlineRocketLaunch color="#A5B5C1" size={18} />,
    text: "78% - 12/04/2024",
  },
  {
    icon: <FaDollarSign color="#A5B5C1" size={18} />,
    text: "87% - 12/04/2024",
  },
  {
    icon: <FaDollarSign color="#A5B5C1" size={18} />,
    text: "91% - 12/04/2024",
  },
  { icon: <LuUsers2 color="#A5B5C1" size={18} />, text: "82% - 12/04/2024" },
  {
    icon: <MdOutlineRocketLaunch color="#A5B5C1" size={18} />,
    text: "79% - 12/04/2024",
  },
];

export default function StartupMatchesCard() {
  const t = useTranslations("startupForm");

  return (
    <div className="w-[300px] h-[350px] bg-[#F1F3F3] shadow-md rounded-lg text-gray-500">
      <div className="flex pl-5 mt-5">
        <Image
          src={arrowMatches}
          alt={t("startupMatchesCard.images.matchesArrow")}
          className="w-7 h-7"
        />
        <span className="text-xl font-bold mb-4 pl-5">
          {t("startupMatchesCard.title")}
        </span>
      </div>
      {matches.length === 0 ? (
        <ul className="space-y-3 mb-4 font-medium pl-5 mt-3">
          {matches.map((match, index) => (
            <li key={index} className="flex items-center gap-1">
              {match.icon}
              {match.text}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center h-full mt-[80px]">
          <AiOutlineWarning color="#A5B5C1" size={48} />
          <span className="text-base font-medium mt-2">
            {t("startupMatchesCard.noMatches")}
          </span>
        </div>
      )}
    </div>
  );
}

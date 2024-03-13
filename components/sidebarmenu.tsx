import React, { ReactElement } from "react";
import Link from "next/link";

interface SidebarLinkProps {
  href: string;
  icon: ReactElement;
  text: string;
  currentRoute: string;
  isSidebarOpen: boolean;
  size: number;
  strokeWidth: number;
}

export default function SidebarMenu({
  href,
  icon,
  text,
  currentRoute,
  isSidebarOpen,
  size,
  strokeWidth,
}: SidebarLinkProps) {
  return (
    <Link href={href}>
      <div
        className={`flex ${
          isSidebarOpen ? "w-64" : "w-full"
        } hover:bg-gray-100 cursor-pointer my-1 p-3 rounded-lg items-center`}
      >
        <div className="flex items-center">
          {React.cloneElement(icon, {
            size,
            className: `${
              currentRoute === href
                ? `text-blue-400 stroke-[${strokeWidth}]`
                : "text-gray-400"
            } ${icon.props.className || ""}`,
          })}
          <span
            className={`${isSidebarOpen ? "flex ml-2" : "hidden"} ${
              currentRoute === href
                ? "text-blue-400 font-medium"
                : "text-gray-400"
            }`}
          >
            {text}
          </span>
        </div>
      </div>
    </Link>
  );
}

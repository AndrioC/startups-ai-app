import React, { ReactElement } from "react";
import Link from "next/link";

interface SidebarLinkProps {
  href: string;
  icon: ReactElement;
  text: string;
  currentRoute: string;
  isSidebarOpen: boolean;
  size: number;
}

export default function SidebarMenu({
  href,
  icon,
  text,
  currentRoute,
  isSidebarOpen,
  size,
}: SidebarLinkProps) {
  const isActive = currentRoute.includes(href);

  return (
    <Link href={href}>
      <div
        className={`relative flex items-center group ${
          isActive ? "bg-blue-50" : ""
        } h-12`}
      >
        {isActive && (
          <>
            {isSidebarOpen ? (
              <div className="absolute left-0 w-9 overflow-hidden inline-block">
                <div className="h-9 w-8 bg-[#2292EA] border border-[#2292EA] rounded-lg rotate-45 -translate-x-[23px]"></div>
              </div>
            ) : (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2292EA]"></div>
            )}
          </>
        )}
        <div
          className={`flex ${
            isSidebarOpen ? "w-72" : "w-full"
          } cursor-pointer items-center ${isSidebarOpen ? "py-2 px-4" : "px-[30px]"} h-full`}
        >
          <div
            className={`flex items-center w-full ${
              isSidebarOpen ? "ml-8" : "p-0"
            }`}
          >
            <div
              className={`flex-shrink-0 ${
                isActive ? "text-[#2292EA]" : "text-gray-400"
              }`}
            >
              {React.cloneElement(icon, { size })}
            </div>
            {isSidebarOpen && (
              <span
                className={`ml-4 ${
                  isActive
                    ? "text-[#2292EA] font-medium"
                    : "text-gray-500 font-normal"
                }`}
              >
                {text}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

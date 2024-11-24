"use client";
import { useState } from "react";
import { BsPeople } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import {
  IoBusinessOutline,
  IoRocketOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";

import HeaderAdmin from "./header/header-admin";
import { Button } from "./ui/button";
import SidebarMenu from "./sidebarmenu";

export default function SideBar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const currentRoute = usePathname();
  const t = useTranslations("admin.sidebar");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getLogo = () => {
    if (isSidebarOpen) {
      return session?.user?.logo_img || logoPlaceholder;
    } else {
      return session?.user?.logo_sidebar || logoPlaceholder;
    }
  };

  const menus = [
    {
      id: 1,
      key: "home",
      title: t("home"),
      href: "/management/home",
      icon: <GoHome />,
      strokeWidth: 0.5,
    },
    {
      id: 2,
      key: "programs",
      title: t("programs"),
      href: "/management/programs",
      icon: <RxDashboard />,
      strokeWidth: 0.5,
    },
    {
      id: 3,
      key: "startups",
      title: t("startups"),
      href: "/management/startups",
      icon: <IoRocketOutline />,
      strokeWidth: 0.5,
    },
    {
      id: 4,
      key: "investors",
      title: t("investors"),
      href: "/management/investors",
      icon: <IoWalletOutline />,
      strokeWidth: 0.5,
    },
    {
      id: 5,
      key: "experts",
      title: t("experts"),
      href: "/management/mentors",
      icon: <BsPeople />,
      strokeWidth: 0.5,
    },
    {
      id: 6,
      key: "companies",
      title: t("companies"),
      href: "/management/companies",
      icon: <IoBusinessOutline />,
      strokeWidth: 0.5,
    },
    {
      id: 7,
      key: "settings",
      title: t("settings"),
      href: "/management/settings",
      icon: <FiSettings />,
      strokeWidth: 2,
    },
  ];

  const getFilteredMenus = () => {
    return menus.filter(
      (menu) => menu.key !== "companies" || session?.user?.isSAI === true
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } h-full bg-white border-r-[1px] flex flex-col transition-all ease-in-out duration-300`}
      >
        <div className="flex flex-col h-full">
          <Link href="/">
            <div className="text-white p-3 mt-4 rounded-lg inline-block">
              <Image
                src={getLogo()}
                alt="sidebar-menu-logo"
                priority
                width={isSidebarOpen ? 300 : 100}
                height={isSidebarOpen ? 100 : 50}
              />
            </div>
          </Link>
          <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
          <div className="flex-grow overflow-y-auto">
            {getFilteredMenus().map((value) => (
              <SidebarMenu
                key={value.id}
                href={value.href}
                icon={value.icon}
                text={value.title}
                currentRoute={currentRoute}
                isSidebarOpen={isSidebarOpen}
                size={20}
              />
            ))}
          </div>
        </div>
        <div className="flex p-4 items-center justify-center bg-gray-100 w-full">
          <Button type="button" variant="ghost" onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <IoIosArrowDropleft size={21} className="text-gray-400" />
            ) : (
              <IoIosArrowDropright size={21} className="text-gray-400" />
            )}
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAdmin />
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { LogOutIcon, Settings, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import logoPlaceholder from "@/assets/img/logo-placeholder.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormStartupDataState } from "@/contexts/FormStartupContext";

import SettingsModal from "./settings-modal";

interface HeaderProps {
  logoAlt: string;
  userName: string;
}

export default function HeaderExternalStartupComponent({
  logoAlt,
  userName,
}: HeaderProps) {
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { initialData } = useFormStartupDataState();

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    const protocol = window.location.protocol;
    const host = window.location.host;

    const redirectUrl = `${protocol}//${host}/auth/login`;
    router.push(redirectUrl);
  };

  const logoUrl = initialData.organizationLogo || logoPlaceholder.src;

  return (
    <header className="w-full bg-[#B4D5EE] rounded-b-lg">
      <div className="mx-auto flex items-center justify-between px-14 py-2">
        <Image src={logoUrl} alt={logoAlt} width={80} height={80} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 bg-gray-200 text-gray-600">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{userName}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center cursor-pointer hover:bg-gray-100"
              onSelect={() => setIsSettingsOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-red-600 cursor-pointer hover:bg-red-100"
              onSelect={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}

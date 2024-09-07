"use client";

import React from "react";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function HeaderAdmin() {
  const { data: session } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "User";
  const initials = getInitials(userName);

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });

    const protocol = window.location.protocol;
    const host = window.location.host;

    const redirectUrl = `${protocol}//${host}/auth/login`;
    router.push(redirectUrl);
  };

  return (
    <div className="flex items-center justify-end p-6 bg-white border-b border-gray-200 cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-500" />
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full p-0 text-xs"
          >
            3
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none group" asChild>
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 border-2 border-blue-500 group-hover:border-blue-600 transition-colors">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{userName}</span>
                <span className="text-xs text-gray-500">
                  Último acesso há 2 meses
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

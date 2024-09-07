"use client";
import React, { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ProfileModal from "./profile-modal";

function getInitials(name: string): string {
  if (!name) {
    return "N/A";
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function HeaderAdmin() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [userName, setUserName] = useState(session?.user?.name || "User");
  const [avatarUrl, setAvatarUrl] = useState(
    session?.user?.user_logo_img || ""
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const initials = getInitials(userName);

  useEffect(() => {
    if (session?.user?.user_logo_img) {
      setAvatarUrl(session.user.user_logo_img);
    }
    if (session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session?.user?.user_logo_img, session?.user?.name]);

  const lastAccessFormatted = useMemo(() => {
    if (session?.user?.last_access) {
      return formatDistanceToNow(new Date(session.user.last_access), {
        addSuffix: true,
        locale: ptBR,
      });
    }
    return "Não disponível";
  }, [session?.user?.last_access]);

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    const protocol = window.location.protocol;
    const host = window.location.host;
    const redirectUrl = `${protocol}//${host}/auth/login`;
    router.push(redirectUrl);
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleUpdateProfile = async (
    name: string | null,
    newAvatarUrl: string | null
  ) => {
    const updatedUser = { ...session?.user };
    let shouldUpdate = false;

    if (name !== null && name !== userName) {
      setUserName(name);
      updatedUser.name = name;
      shouldUpdate = true;
    }

    if (newAvatarUrl !== null && newAvatarUrl !== avatarUrl) {
      setAvatarUrl(newAvatarUrl);
      updatedUser.user_logo_img = newAvatarUrl;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      await update({
        ...session,
        user: updatedUser,
      });
    }
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
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={userName} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{userName}</span>
                <span className="text-xs text-gray-500">
                  Último acesso {lastAccessFormatted}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleOpenProfileModal}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
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
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        userName={userName}
        avatarUrl={avatarUrl}
        onUpdateProfile={handleUpdateProfile}
        userId={session?.user?.id!}
        organizationId={Number(session?.user?.organization_id!)}
      />
    </div>
  );
}

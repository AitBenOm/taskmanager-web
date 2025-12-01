"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/auth.store";

interface TopNavProps {
    onOpenMobileSidebar: () => void;
}

export function TopNav({ onOpenMobileSidebar }: TopNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const title = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">

            {/* LEFT SECTION: MOBILE MENU + TITLE */}
            <div className="flex items-center gap-3">
                {/* Mobile Sidebar Button */}
                <button className="md:hidden text-gray-700" onClick={onOpenMobileSidebar}>
                    <Menu size={22} />
                </button>

                <h1 className="text-lg font-semibold text-gray-900 capitalize">
                    {title}
                </h1>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-6">

                {/* SEARCH BAR */}
                <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 h-9 rounded-md border border-gray-200">
                    <Search size={16} className="text-gray-500" />
                    <Input
                        placeholder="Search..."
                        className="h-8 w-48 bg-transparent border-none focus-visible:ring-0 text-sm"
                    />
                </div>

                {/* NOTIFICATIONS ICON */}
                <button className="relative text-gray-700 hover:text-gray-900">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                </button>

                {/* USER MENU */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                        <Avatar className="h-9 w-9 border border-gray-300">
                            <AvatarImage src={user?.avatarUrl} />
                            <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-md py-2">

                        {/* USER INFO */}
                        <div className="px-4 py-2">
                            <p className="font-semibold text-gray-900">{user?.fullName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push("/dashboard/profile")}
                        >
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push("/dashboard/settings")}
                        >
                            Settings
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => {
                                logout();
                                router.push("/auth/login");
                            }}
                        >
                            Logout
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

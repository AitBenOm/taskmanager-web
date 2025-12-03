"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export function TopNav() {
    const user = useAuthStore((s) => s.user);

    return (
        <header className="w-full h-16 bg-[#0F213A] border-b border-[#23456A] flex items-center px-6 shadow-md">

            <div className="flex items-center justify-between w-full">

                {/* TITLE */}
                <h1 className="text-[#E8F0FF] font-semibold text-lg tracking-tight">
                    Dashboard
                </h1>

                {/* SEARCH BAR */}
                <div className="hidden md:flex items-center gap-2 px-3 h-10 w-72 rounded-sm border border-[#23456A] bg-[#142C4A] text-[#AFC6E6]">
                    <Search size={18} className="text-[#94B4D6]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-sm text-[#D9E9FF] placeholder-[#7FA5C7] focus:outline-none"
                    />
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-6">

                    {/* NOTIFICATIONS */}
                    <button className="p-2 rounded-sm border border-transparent hover:border-[#23456A] hover:bg-[#15365A] transition-all">
                        <Bell size={20} className="text-[#AFC6E6]" />
                    </button>

                    {/* AVATAR */}
                    <div className="w-9 h-9 bg-[#142C4A] border border-[#23456A] flex items-center justify-center text-[#E8F0FF] text-sm font-medium">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                </div>

            </div>
        </header>
    );
}

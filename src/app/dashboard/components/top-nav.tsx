"use client";

import { Menu } from "lucide-react";
import {useUiStore} from "@/store/ui-store";

export default function TopNav() {
    const { toggleSidebar } = useUiStore();

    return (
        <nav
            className="w-full h-16 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-[#15345C] to-[#112B4A] backdrop-blur-xl border-b border-white/10 shadow-lg"
        >
            {/* Collapse Sidebar Button */}
            <button
                onClick={toggleSidebar}
                className="hidden md:flex p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-md transition"
            >
                <Menu size={22} />
            </button>


            <div className="text-white font-medium text-lg">
                Dashboard
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
        </nav>
    );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    ListTodo,
    Users,
    Calendar,
    Bell,
    Settings,
    LogOut
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    const NAV_ITEMS = [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/dashboard/profile", icon: User },
        { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
        { label: "Groups", href: "/dashboard/family", icon: Users },
        { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
        { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    return (
        <div className="relative h-full w-64 bg-[#0F213A] border-r border-[#23456A] flex flex-col shadow-[4px_0_12px_rgba(0,0,0,0.25)]">

            {/* LOGO */}
            <div className="px-6 py-6 text-xl font-bold text-[#E8F0FF] tracking-tight">
                TM
            </div>

            <div className="px-6 pb-3 text-[11px] uppercase tracking-wider text-[#8FA9C9]">
                Navigation
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 px-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const active = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm rounded-sm transition-all border",
                                active
                                    ? "bg-[#1E4C7A] border-[#3BA7F1] text-[#D9E9FF] shadow-sm"
                                    : "text-[#AFC6E6] border-transparent hover:bg-[#15365A] hover:border-[#2D5C89] hover:text-white"
                            )}
                        >
                            <Icon size={18} className={active ? "text-[#D9E9FF]" : "text-[#94B4D6]"} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* ACCOUNT */}
            <div className="px-6 pt-4 pb-2 text-[11px] uppercase tracking-wider text-[#8FA9C9]">
                Account
            </div>

            <div className="p-4">
                <button
                    onClick={() => {
                        logout();
                        router.push("/auth/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#15365A] hover:text-red-300 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}

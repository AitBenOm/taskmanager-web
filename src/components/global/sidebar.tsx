"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

import {
    Home,
    User,
    ListTodo,
    Users,
    Calendar,
    Bell,
    Settings,
    LogOut
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
    { label: "Family", href: "/dashboard/family", icon: Users },
    { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    return (
        <div className="h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">

            {/* LOGO */}
            <div className="px-6 py-6 text-2xl font-bold text-blue-600 tracking-tight">
                TaskManager
            </div>

            <Separator />

            {/* NAVIGATION */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm transition",
                                    active
                                        ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>

            <Separator />

            {/* LOGOUT */}
            <div className="p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                    onClick={() => {
                        logout();
                        router.push("/auth/login");
                    }}
                >
                    <LogOut size={18} className="mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Calendar,
    CheckCircle2,
    Target,
    BarChart3,
    MessageSquare,
    Bell,
    User,
    Settings,
    KanbanSquare,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import {useUiStore} from "@/store/ui-store";


export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, sectionState, toggleSection } = useUiStore();

    const menuSections = [
        {
            section: "WORKSPACE",
            items: [
                { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { name: "My Day", href: "/dashboard/myday", icon: Target },
                { name: "Tasks", href: "/dashboard/tasks", icon: CheckCircle2 },
                { name: "Kanban", href: "/dashboard/kanban", icon: KanbanSquare },
                { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
            ],
        },
        {
            section: "PRODUCTIVITY",
            items: [
                { name: "Goals", href: "/dashboard/goals", icon: Target },
                { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
                { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
                { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
            ],
        },
        {
            section: "ACCOUNT",
            items: [
                { name: "Profile", href: "/dashboard/profile", icon: User },
                { name: "Settings", href: "/dashboard/settings", icon: Settings },
            ],
        },
    ];

    return (
        <aside
            className={`
        hidden md:flex flex-col h-screen
        bg-gradient-to-b from-[#0A2A55]/95 to-[#001B33]/95
        backdrop-blur-xl border-r border-white/10
        shadow-[0_4px_20px_rgba(0,0,0,0.45)]
        text-slate-200 transition-all duration-300
        ${sidebarCollapsed ? "w-20" : "w-64"}
      `}
        >
            {/* LOGO */}
            <div className="flex items-center justify-center my-8">
                {!sidebarCollapsed ? (
                    <span className="text-xl font-semibold text-white tracking-wide">
            TaskManager
          </span>
                ) : (
                    <span className="text-xl font-bold text-white">TM</span>
                )}
            </div>

            {/* MENU LIST */}
            <div className="flex flex-col gap-6 px-3 overflow-y-auto sidebar-scroll">
                {menuSections.map((section, idx) => {
                    const isOpen = sectionState[section.section];

                    return (
                        <div key={idx}>
                            {/* SECTION HEADER */}
                            {!sidebarCollapsed && (
                                <button
                                    onClick={() => toggleSection(section.section)}
                                    className="w-full flex items-center justify-between text-slate-400 text-xs tracking-wider mb-2 px-1"
                                >
                                    {section.section}
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                            )}

                            {/* SECTION ITEMS */}
                            {isOpen && (
                                <div className="flex flex-col gap-1">
                                    {section.items.map((item) => {
                                        const active = pathname === item.href;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`
                          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                          transition-all duration-200
                          ${
                                                    active
                                                        ? "bg-[#007BFF]/20 text-[#58AFFF] border border-[#007BFF]/30 shadow-md"
                                                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                                                }
                          ${sidebarCollapsed ? "justify-center" : ""}
                        `}
                                            >
                                                <item.icon
                                                    size={20}
                                                    className={active ? "text-[#58AFFF]" : "text-slate-300"}
                                                />

                                                {!sidebarCollapsed && item.name}

                                                {/* Tooltip on collapsed */}
                                                {sidebarCollapsed && (
                                                    <span
                                                        className="
                              invisible group-hover:visible absolute left-20 z-40
                              bg-black/80 text-white text-xs py-1 px-2 rounded-md shadow-lg
                            "
                                                    >
                            {item.name}
                          </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* FOOTER PROFILE */}
            <div
                className={`mt-auto flex items-center gap-3 px-3 py-4 ${
                    sidebarCollapsed ? "justify-center" : ""
                }`}
            >
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    O
                </div>

                {!sidebarCollapsed && (
                    <div>
                        <p className="text-sm font-semibold text-white">Omar</p>
                        <p className="text-xs text-slate-400">View Profile</p>
                    </div>
                )}
            </div>
        </aside>
    );
}

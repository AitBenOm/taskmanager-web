"use client";

import { useState } from "react";
import Sidebar from "@/app/dashboard/components/sidebar";
import TopNav from "@/app/dashboard/components/top-nav";
import BottomNav from "@/app/dashboard/components/BottomNav";

export default function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat"
            style={{ backgroundImage: "url('/dashboard-bg.png')" }}
        >
        <div className="flex w-full h-screen overflow-hidden">

            {/* DESKTOP SIDEBAR */}
            <div className="hidden md:block">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 h-full flex flex-col overflow-hidden">

                {/* TOP NAV */}
                <TopNav
                    collapsed={collapsed}
                    toggleSidebar={() => setCollapsed((prev) => !prev)}
                />

                {/* CONTENT (scrolls inside only) */}
                <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-6">
                    {children}
                </main>

                {/* MOBILE NAV */}
                <BottomNav />
            </div>
        </div>
        </div>
    );
}

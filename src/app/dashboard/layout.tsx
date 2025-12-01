"use client";

import { useState } from "react";


import { Sheet, SheetContent } from "@/components/ui/sheet";
import {Sidebar} from "@/components/global/sidebar";
import {TopNav} from "@/components/global/top-nav";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-[#F5F7FA]">

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:block">
                <Sidebar />
            </aside>

            {/* MOBILE SIDEBAR (Drawer) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* MAIN CONTENT */}
            <div className="flex flex-col flex-1">
                <TopNav onOpenMobileSidebar={() => setMobileOpen(true)} />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}

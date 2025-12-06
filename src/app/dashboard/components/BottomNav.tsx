"use client";

import { useState } from "react";
import BottomNavDropdown from "./BottomNavDropdown";
import {menuSections} from "../../../../public/config/menuSections";

export default function BottomNav() {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggle = (section: string) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    return (
        <>
            <BottomNavDropdown
                openSection={openSection}
                close={() => setOpenSection(null)}
            />

            <nav
                className="fixed bottom-0 left-0 w-full h-16 flex items-center justify-around bg-gradient-to-r from-[#0A2A55]/90 to-[#001B33]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.35)] md:hidden z-50"
            >
                {menuSections.map((section) => (
                    <button
                        key={section.section}
                        onClick={() => toggle(section.section)}
                        className="flex flex-col items-center justify-center text-slate-200 text-xs"
                    >
                        <div
                            className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                ${
                                openSection === section.section
                                    ? "bg-[#007BFF]/20 text-[#58AFFF] border border-[#007BFF]/30"
                                    : "text-slate-300 hover:text-white hover:bg-white/10"
                            }
              `}
                        >
                            {section.section[0]}
                        </div>

                        <span
                            className={`
                mt-1 text-[11px]
                ${
                                openSection === section.section
                                    ? "text-[#58AFFF]"
                                    : "text-slate-300"
                            }
              `}
                        >
              {section.section}
            </span>
                    </button>
                ))}
            </nav>
        </>
    );
}

"use client";

import Link from "next/link";
import {menuSections} from "../../../../public/config/menuSections";

export default function BottomNavDropdown({ openSection, close }) {
    if (!openSection) return null;

    const section = menuSections.find((s) => s.section === openSection);

    return (
        <div
            className="
        fixed bottom-20 left-1/2 -translate-x-1/2 w-72
        bg-gradient-to-b from-[#0A2A55]/95 to-[#001B33]/95
        backdrop-blur-xl border border-white/10
        rounded-2xl shadow-xl p-3 z-50
        animate-fadeSlideUp
      "
        >
            <p className="text-xs text-slate-300 mb-2 px-1 tracking-wider">
                {section.section}
            </p>

            <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={close}
                        className="
              px-3 py-2 rounded-xl text-sm text-slate-200
              hover:bg-white/10 hover:text-white transition
            "
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

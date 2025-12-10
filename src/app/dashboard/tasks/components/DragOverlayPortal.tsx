"use client";

import { createPortal } from "react-dom";

export default function DragOverlayPortal({ children }) {
    if (typeof window === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {children}
        </div>,
        document.body
    );
}

"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export default function DroppableColumn({ id, children, className }) {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { type: "column", columnId: id },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex-1 min-h-full rounded-xl overflow-y-auto overflow-x-hidden p-4 transition-all",
                className,
                isOver && "bg-blue-100/40 border-blue-300 border"
            )}
        >
            <div className="flex flex-col gap-4 min-h-full">
                {children}
            </div>
        </div>
    );
}

"use client";

import {useDroppable} from "@dnd-kit/core";

const columnColors = {
    TODO: "bg-gradient-to-b from-blue-50 to-blue-100",
    IN_PROGRESS: "bg-gradient-to-b from-purple-50 to-purple-100",
    DONE: "bg-gradient-to-b from-green-50 to-green-100",
};

export function FlowColumn({
                               title,
                               tasksCount,
                               avatars,
                               children,
                               status, // must be passed from parent (your board already knows the status)
                               mobileWidth,
                               id
                           }) {
    const {setNodeRef, isOver} = useDroppable({id});

    return (
        <div
            ref={setNodeRef}
            className={`
                min-h-[120px] transition
                ${isOver ? "bg-blue-50/40" : ""}
            `}
        >
            <div
                className={`
        rounded-2xl border border-gray-200 shadow-md p-4 
        flex flex-col h-full overflow-hidden
        ${mobileWidth ? "min-w-[85vw] sm:min-w-[350px]" : ""}
        ${columnColors[status]}
      `}
            >
                {/* Header */}
                <div className="mb-3 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600">{tasksCount} tasks</p>
                </div>

                {/* Scrollable cards */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scroll">
                    {children}
                </div>
            </div>
        </div>
    );
}

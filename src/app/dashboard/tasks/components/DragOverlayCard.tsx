"use client";


import {TaskCard} from "@/app/dashboard/tasks/components/TaskCard";

export default function DragOverlayCard({ task }) {
    if (!task) return null;

    return (
        <div className="scale-105 opacity-95 shadow-2xl pointer-events-none z-[9999]">
            <TaskCard task={task} />
        </div>
    );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {TaskCard} from "@/app/dashboard/tasks/components/TaskCard";

export default function SortableTaskCard({ task, onClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || "transform 180ms cubic-bezier(.25,.8,.25,1)",
        opacity: isDragging ? 0.35 : 1,
        pointerEvents: isDragging ? "none" : "auto",
        zIndex: isDragging ? 10 : "auto",
        position: "relative",
        cursor: "grab",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="w-full"
        >
            <TaskCard task={task} onClick={onClick} />
        </div>
    );
}

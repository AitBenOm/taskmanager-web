"use client";

import {cn} from "@/lib/utils";
import {useTaskStore} from "@/store/task-store";
import {User} from "lucide-react";
import {Task} from "@/types/task";
import {useCallback} from "react";

// Priority → Premium Colors
const priorityColors: Record<string, string> = {
    LOW: "from-[#BFD5E5]/40 to-[#EAF3FA]/40 border-[#C8D9E8]/50",
    MEDIUM: "from-[#3BA4F4]/20 to-[#A0E9FF]/20 border-[#4DAFFF]/40",
    HIGH: "from-[#FFB54C]/25 to-[#FFE5BD]/25 border-[#FFB547]/40",
    URGENT: "from-[#FF5A6E]/25 to-[#FFC1C7]/25 border-[#FF475E]/40",
};

// Status → Colors
const statusColors: Record<string, string> = {
    TODO: "text-blue-600 bg-blue-100",
    IN_PROGRESS: "text-amber-600 bg-amber-100",
    DONE: "text-green-600 bg-green-100",
    ARCHIVED: "text-gray-500 bg-gray-200",
};

export function TaskCard({
                             task,
                             onClick,
                         }: {
    task: Task;
    onClick?: () => void;
}) {
    const getProgress = useTaskStore((s) => s.getProgress);
    const getCompleted = useTaskStore((s) => s.getCompletedSubtasksCount);

    const subtasks = task.subtasks ?? [];


    const completed = getCompleted(task);
    const progress = getProgress(task);

    const handleClick = useCallback(() => {
        if (onClick) return onClick();
    }, [onClick]);

    return (
        <div
            onClick={handleClick}
            className={cn(
                "relative w-full cursor-pointer rounded-xl p-4 transition-all duration-200",
                "border shadow-md backdrop-blur-xl",
                "hover:shadow-xl hover:scale-[1.02]",
                // Gradient background from priority
                `bg-gradient-to-br ${priorityColors[task.priority] ?? priorityColors.MEDIUM}`
            )}
        >
            {/* Subtask Dots (Top-right) */}
            {subtasks.length > 0 && (
                <div className="absolute top-3 right-3 flex gap-1">
                    {subtasks.slice(0, 5).map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full animate-pulse",
                                s.status === "DONE" ? "bg-green-500" : "bg-gray-400"
                            )}
                        />
                    ))}

                    {/* “+N” if more subtasks */}
                    {subtasks.length > 5 && (
                        <span className="text-[10px] text-gray-600 font-medium">
              +{subtasks.length - 5}
            </span>
                    )}
                </div>
            )}

            {/* Priority Badge */}
            <div className="mb-2">
        <span
            className="px-2 py-1 text-xs font-semibold rounded-lg bg-white/30 backdrop-blur-lg border border-white/30 shadow-md">
          {task.priority}
        </span>
            </div>

            {/* Title */}
            <h3 className="text-gray-900 font-semibold text-base mb-1">{task.title}</h3>

            {/* Optional description preview */}
            {task.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/30">
                {/* Status Badge */}
                <span
                    className={cn(
                        "px-2 py-1 text-xs rounded-md font-medium",
                        statusColors[task.status]
                    )}
                >
          {task.status.replace("_", " ")}
        </span>

                {/* Progress */}
                {subtasks.length > 0 && (
                    <span className="text-xs text-gray-700 font-medium">
            {completed}/{subtasks.length}
          </span>
                )}

                {/* Avatar */}
                <div
                    className="w-7 h-7 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-sm">
                    {task.assignedTo ? (
                        <img
                            src={task.assignedTo.avatarUrl ?? "/avatars/default.png"}
                            alt="avatar"
                            className="w-7 h-7 rounded-full"
                        />
                    ) : (
                        <User className="w-4 h-4 text-gray-700"/>
                    )}
                </div>
            </div>
        </div>
    );
}

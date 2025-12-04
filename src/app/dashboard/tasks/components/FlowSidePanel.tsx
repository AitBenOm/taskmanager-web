"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";

interface FlowSidePanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: any;
    toggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function FlowSidePanel({open, onOpenChange, task, toggleSubtask}: FlowSidePanelProps) {
    if (!task) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="
          w-[420px] bg-white border-l border-gray-200 shadow-xl
          overflow-y-auto
        "
            >
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold">
                        {task.title}
                    </SheetTitle>
                </SheetHeader>

                {/* DESCRIPTION */}
                <div className="mt-6">
                    <p className="text-gray-800 font-medium mb-1">Description</p>
                    <p className="text-gray-600">
                        {task.description || "No description."}
                    </p>
                </div>

                <Separator className="my-5"/>

                {/* SUBTASKS */}
                {/* SUBTASKS */}
                <div>
                    <p className="text-gray-800 font-medium mb-2">Subtasks</p>

                    <div className="space-y-3">
                        {(task.subtasks ?? []).map((st: any) => (
                            <label key={st.id} className="flex items-center gap-2">
                                <Checkbox
                                    checked={st.done}
                                    onCheckedChange={() => toggleSubtask(task.id, st.id)}
                                />
                                <span
                                    className={`text-sm ${
                                        st.done ? "line-through text-gray-400" : "text-gray-700"
                                    }`}
                                >
          {st.text}
        </span>
                            </label>
                        ))}
                    </div>
                </div>


                <Separator className="my-5"/>

                {/* DUE DATE */}
                <div>
                    <p className="text-gray-800 font-medium mb-1">Due date</p>
                    <p className="text-gray-600">{task.due}</p>
                </div>

                <Separator className="my-5"/>

                {/* ACTIVITY LOG */}
                <div>
                    <p className="text-gray-800 font-medium mb-2">Activity</p>

                    <div className="text-sm space-y-2">
                        {task.activity?.length ? (
                            task.activity.map((evt: any, i: number) => (
                                <p key={i} className="text-gray-600">
                                    • {evt.text || `${evt.type} update`}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No activity yet.</p>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

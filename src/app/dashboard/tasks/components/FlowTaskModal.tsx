"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

interface FlowTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: any | null;
    toggleSubtask: (taskId: string, subId: string) => void;
}

export default function FlowTaskModal({
                                          open,
                                          onClose,
                                          task,
                                          toggleSubtask,
                                      }: FlowTaskModalProps) {
    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black rounded-xl shadow-2xl max-w-lg p-6 border border-gray-200">

                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {task.title}
                    </DialogTitle>
                </DialogHeader>

                {/* DESCRIPTION */}
                <div className="mt-5 space-y-6">
                    <div>
                        <p className="font-medium text-gray-800 mb-1">Description</p>
                        <p className="text-gray-600">{task.description}</p>
                    </div>

                    <Separator />

                    {/* PROGRESS */}
                    <div>
                        <p className="font-medium text-gray-800 mb-1">Progress</p>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* SUBTASKS */}
                    <div>
                        <p className="font-medium text-gray-800 mb-2">Subtasks</p>

                        <div className="space-y-3">
                            {(task.subtasks ?? []).map((st: any) => (
                                <label
                                    key={st.id}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={st.done}
                                        onChange={() => toggleSubtask(task.id, st.id)}
                                        className="w-5 h-5 accent-blue-500"
                                    />
                                    <span
                                        className={`${
                                            st.done ? "line-through text-gray-400" : "text-gray-700"
                                        }`}
                                    >
                    {st.text}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* DUE DATE */}
                    <div>
                        <p className="font-medium text-gray-800 mb-1">Due date</p>
                        <p className="text-gray-600">{task.due}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

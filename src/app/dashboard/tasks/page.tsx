"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ---- PRIORITY SHADOW MAP ----
const priorityShadows: any = {
    LOW: "shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]",
    MEDIUM: "shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)]",
    HIGH: "shadow-[0_4px_14px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]",
    URGENT: "shadow-[0_4px_14px_rgba(255,0,0,0.10)] hover:shadow-[0_14px_32px_rgba(255,0,0,0.22)]",
};

// ------------------------------
export default function TasksPage() {
    const [taskList, setTaskList] = useState<any[]>([]);
    const [view, setView] = useState<"list" | "kanban">("list");
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [hoverTask, setHoverTask] = useState<any | null>(null);

    // Kanban columns
    const columns = [
        { key: "TODO", label: "To Do" },
        { key: "IN_PROGRESS", label: "In Progress" },
        { key: "DONE", label: "Done" },
    ];

    // Load the JSON mock file
    useEffect(() => {
        async function load() {
            const res = await fetch("/mock/mockTasks.json");
            const data = await res.json();
            setTaskList(data);
        }
        load();
    }, []);

    // Toggle subtask
    const toggleSubtask = (taskId: string, subtaskId: string) => {
        setTaskList((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        subtasks: t.subtasks.map((st: any) =>
                            st.id === subtaskId ? { ...st, done: !st.done } : st
                        ),
                    }
                    : t
            )
        );

        if (selectedTask) {
            setSelectedTask((prev: any) => ({
                ...prev,
                subtasks: prev.subtasks.map((st: any) =>
                    st.id === subtaskId ? { ...st, done: !st.done } : st
                ),
            }));
        }
    };

    // Priority badge color
    const priorityColors: any = {
        LOW: "bg-gray-100 text-gray-700",
        MEDIUM: "bg-blue-100 text-blue-700",
        HIGH: "bg-yellow-100 text-yellow-700",
        URGENT: "bg-red-100 text-red-700",
    };

    return (
        <div className="w-full flex flex-col gap-6">

            {/* ---------------- HEADER ---------------- */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-black">Tasks</h1>

                <div className="flex items-center gap-3">
                    {/* View Switcher */}
                    <div className="flex bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-2 text-sm ${
                                view === "list"
                                    ? "bg-white text-black font-medium shadow-inner"
                                    : "text-gray-600 hover:text-black"
                            }`}
                        >
                            List
                        </button>

                        <button
                            onClick={() => setView("kanban")}
                            className={`px-4 py-2 text-sm ${
                                view === "kanban"
                                    ? "bg-white text-black font-medium shadow-inner"
                                    : "text-gray-600 hover:text-black"
                            }`}
                        >
                            Board
                        </button>
                    </div>

                    <Button className="rounded-full px-5 h-10 bg-[#1A4D7A] hover:bg-[#153E63] shadow-lg text-white">
                        + New Task
                    </Button>
                </div>
            </div>

            {/* ---------------- MAIN CONTAINER ---------------- */}
            <div className="w-full min-h-[500px] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">

                {/* ---------------- LIST VIEW ---------------- */}
                {view === "list" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                        {taskList.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}

                                className={`
                  bg-white rounded-xl border border-gray-200/80 p-4 cursor-pointer
                  transition-all duration-300 animate-riseIn

                  ${priorityShadows[task.priority]}
                  hover:-translate-y-[3px]
                `}
                            >
                                <p className="font-semibold text-gray-900 text-md truncate">
                                    {task.title}
                                </p>

                                <div className="w-full h-[1px] bg-gray-200 my-2"></div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>

                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {task.description}
                                </p>

                                <div className="flex items-center gap-2 mt-3 text-xs">
                  <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                    {task.status}
                  </span>
                                    <span className={`px-2 py-1 rounded-md ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                                    <span className="ml-auto text-gray-500">{task.due}</span>
                                </div>

                                {/* Hover Preview Tooltip */}
                                {hoverTask?.id === task.id && (
                                    <div className="absolute z-50 mt-2 p-3 bg-white rounded-lg shadow-xl w-60 border border-gray-200 text-xs animate-fadeIn">
                                        <p className="font-semibold text-gray-900 mb-1">{task.title}</p>
                                        <p className="text-gray-600">{task.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ---------------- KANBAN VIEW ---------------- */}
                {view === "kanban" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                        {columns.map((col) => (
                            <div key={col.key} className="flex flex-col">
                                <h3 className="text-gray-800 font-semibold mb-3">{col.label}</h3>

                                <div className="flex flex-col gap-4">
                                    {taskList
                                        .filter((t) => t.status === col.key)
                                        .map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className={`
                          bg-white rounded-xl border border-gray-200/80 p-4 cursor-pointer
                          transition-all duration-300 animate-riseIn

                          ${priorityShadows[task.priority]}
                          hover:-translate-y-[3px]
                        `}
                                            >
                                                <p className="font-semibold text-gray-900">
                                                    {task.title}
                                                </p>
                                                <div className="w-full h-[1px] bg-gray-200 my-2"></div>

                                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                </div>

                                                <p className="text-xs text-gray-600">
                                                    {task.description}
                                                </p>

                                                <div className="flex items-center gap-2 mt-3 text-xs">
                          <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                            {task.status}
                          </span>
                                                    <span className={`px-2 py-1 rounded-md ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                                                    <span className="ml-auto text-gray-500">{task.due}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ---------------- MODAL ---------------- */}
            <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
                <DialogContent className="bg-white text-black rounded-xl shadow-2xl max-w-lg p-6 border border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {selectedTask?.title}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedTask && (
                        <div className="mt-4 space-y-6">

                            {/* DESCRIPTION */}
                            <div>
                                <p className="font-medium text-gray-800 mb-1">Description</p>
                                <p className="text-gray-600">{selectedTask.description}</p>
                            </div>

                            {/* PROGRESS */}
                            <div>
                                <p className="font-medium text-gray-800 mb-1">Progress</p>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${selectedTask.progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* SUBTASKS */}
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Subtasks</p>

                                <div className="space-y-3">
                                    {selectedTask.subtasks.map((st: any) => (
                                        <label key={st.id} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={st.done}
                                                onChange={() => toggleSubtask(selectedTask.id, st.id)}
                                                className="w-5 h-5 accent-blue-500"
                                            />
                                            <span className={`${st.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {st.text}
                      </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* DUE DATE */}
                            <div>
                                <p className="font-medium text-gray-800 mb-1">Due date</p>
                                <p className="text-gray-600">{selectedTask.due}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

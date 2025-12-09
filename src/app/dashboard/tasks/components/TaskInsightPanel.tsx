"use client";

import {Calendar, CheckCircle2, Clock, Plus, X} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {useTaskStore} from "@/store/task-store";
import {useAuthStore} from "@/store/auth.store";

export default function TaskInsightPanel({
                                             open,
                                             onClose,
                                             task,
                                             groupId,
                                         }: any) {
    const isNew = !task;

    const [newSubtask, setNewSubtask] = useState("");
    const createTask = useTaskStore((s) => s.createTask);
    const updateTask = useTaskStore((s) => s.updateTask);
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const user = useAuthStore((s) => s.user);

    const [localTitle, setLocalTitle] = useState("");
    const [localDescription, setLocalDescription] = useState("");
    const [localPriority, setLocalPriority] = useState("MEDIUM");
    const [localStatus, setLocalStatus] = useState("TODO");
    const [localDueDate, setLocalDueDate] = useState(null);

    const [localAssignedId, setLocalAssignedId] = useState(null);

    const handleCreateTask = async () => {
        const newTask = await createTask({
            title: localTitle,
            description: localDescription,
            priority: localPriority,
            status: localStatus,
            dueDate: localDueDate,
            assignedToId: user?.id,
            createdById: user?.id,
            groupId: groupId,    // You must provide this value from TaskPageskPage
        });

        onClose();
    };
    const handleToggleSubtask = async (subtask: any) => {

        const newStatus = subtask.status === "DONE" ? "TODO" : "DONE";
        await updateTask(subtask.id, {status: newStatus});

    };
    const handleAddSubtask = async (taskId: string) => {
        console.log("Adding subtask:", newSubtask);
        if (isNew) return;
        if (!newSubtask.trim()) return;

        await createTask({
            title: newSubtask,
            parentId: taskId,
            status: "TODO",
            priority: "MEDIUM",
            assignedToId: user?.id,
            description: "",
            groupId: groupId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        setNewSubtask(""); // clear the input

    }
    const handleSaveTask = async () => {

        console.log("user:", user);
        if (!task) return;
        const newVar = {
            title: localTitle,
            description: localDescription,
            priority: localPriority,
            status: localStatus,
            dueDate: localDueDate,
            assignedToId: localAssignedId,
        };
        console.log("updated:", newVar);
        await updateTask(task.id, newVar);
        setNewSubtask(""); // clear the input
        console.log("user:", user);
        onClose(); // close side panel


    };

    useEffect(() => {

        if (!task) {
            // CREATE mode → reset fields
            setLocalTitle("");
            setLocalDescription("");
            setLocalPriority("MEDIUM");
            setLocalStatus("TODO");
            setLocalDueDate(null);
            setLocalAssignedId(null);
            return;
        }

        // EDIT mode → load task
        setLocalTitle(task.title);
        setLocalDescription(task.description ?? "");
        setLocalPriority(task.priority || "MEDIUM");
        setLocalStatus(task.status || "TODO");
        setLocalDueDate(task.dueDate ?? null);
        setLocalAssignedId(task.assignedToId ?? null);

    }, [task]);

    if (!open) return null;


    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs transition",
                open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            {/* RIGHT PANEL */}
            <div
                className="
                    w-[480px] h-full
                    bg-gradient-to-b bg-gradient-to-b
from-[#142f54]/75
    to-[#0a1e36]/75

                    border-l border-white/10 shadow-xl
                    text-white flex flex-col relative
                    animate-slide-left
                "
            >
                {/* HEADER */}
                <div className="p-6 pb-4 flex items-start justify-between">
                    <div>
                        <input
                            className="text-2xl font-semibold bg-transparent w-full focus:outline-none border-b border-white/20 pb-1"
                            placeholder={isNew ? "New Task" : "Task Title"}
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                        />


                        <div className="flex items-center gap-2 mt-3">


                            {/* User
                            <section>
                                <h3 className="text-sm font-semibold text-white/70 mb-2">Assigned To</h3>

                                <div className="relative">
                                    <button
                                        onClick={() => setOpenUserDropdown(!openUserDropdown)}
                                        className="
                w-full p-2 rounded-xl bg-white/5 border border-white/10
                text-left text-white
            "
                                    >
                                        {localAssignedId
                                            ? users.find((u) => u.id === localAssignedId)?.name
                                            : "Unassigned"}
                                    </button>

                                    {openUserDropdown && (
                                        <div className="absolute z-50 mt-2 w-full bg-[#0A2A55] rounded-xl border border-white/20 shadow-lg">
                                            {users.map((u) => (
                                                <div
                                                    key={u.id}
                                                    onClick={() => {
                                                        setLocalAssignedId(u.id);
                                                        setOpenUserDropdown(false);
                                                    }}
                                                    className="p-3 hover:bg-white/10 cursor-pointer text-white"
                                                >
                                                    {u.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section> */}

                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <Separator className="bg-white/10"/>

                {/* BODY SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scroll">

                    <div className="mt-4 space-y-4">

                        {/* STATUS SECTION */}
                        <section>
                            <h3 className="text-sm font-semibold text-white/70 mb-1">Status</h3>

                            <div className="flex flex-wrap gap-2">
                                {["TODO", "IN_PROGRESS", "DONE", "ARCHIVED"].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setLocalStatus(s)}
                                        className={`
                        px-3 py-1 rounded-lg text-xs font-semibold
                        bg-white/10 border border-white/20
                        hover:bg-white/20 transition
                        ${localStatus === s ? "bg-white/20 border-blue-300 text-blue-200" : "text-white/70"}
                    `}
                                    >
                                        {s.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* PRIORITY SECTION (below Status) */}
                        <section>
                            <h3 className="text-sm font-semibold text-white/70 mb-1">Priority</h3>

                            <div className="flex flex-wrap gap-2">
                                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setLocalPriority(p)}
                                        className={`
                        px-3 py-1 rounded-lg text-xs font-semibold
                        bg-white/10 border border-white/20
                        hover:bg-white/20 transition
                        ${localPriority === p ? "bg-white/20 border-pink-300 text-pink-200" : "text-white/70"}
                    `}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* DESCRIPTION */}
                    <section>
                        <h3 className="text-sm font-semibold text-white/70 mb-2">Description</h3>

                        <textarea
                            className="
            w-full bg-white/5 rounded-xl border border-white/10
            p-4 text-white resize-none focus:outline-none
        "
                            rows={4}
                            placeholder="Write a description..."
                            value={localDescription}
                            onChange={(e) => setLocalDescription(e.target.value)}
                        />
                    </section>


                    {/* SUBTASKS */}
                    {!isNew && (
                        <section>
                            <div className="mt-3 flex gap-2">
                                <input
                                    className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                                    placeholder="Add new subtask..."
                                    value={newSubtask}
                                    onChange={(e) => setNewSubtask(e.target.value)}
                                />

                                <button
                                    onClick={() => {
                                        handleAddSubtask(task.id);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-blue-500/30 border border-blue-500/40 text-white hover:bg-blue-500/50"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-white/70">Subtasks</h3>

                                {/* Progress */}
                                <span className="
                                text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10
                            ">
                                {task.subtasks?.filter((s: any) => s.status === "DONE").length || 0} /
                                    {task.subtasks?.length || 0}
                            </span>
                            </div>

                            <div className="space-y-3">
                                {(task.subtasks ?? []).map((st: any) => (
                                    <div
                                        key={st.id}
                                        className="
            flex items-center gap-3
            bg-white/5 p-2 rounded-xl border border-white/10
            hover:bg-white/10 transition
        "
                                    >
                                        {/* Checkbox: UI ONLY */}
                                        <input
                                            type="checkbox"
                                            checked={st.status === "DONE"}
                                            onChange={() => {
                                                handleToggleSubtask(st);
                                            }}
                                            className="w-4 h-4 accent-blue-400"
                                        />

                                        {/* Title */}
                                        <span
                                            className={st.status === "DONE"
                                                ? "line-through text-white/40"
                                                : "text-white"
                                            }
                                        >
            {st.title}
        </span>

                                        {/* Priority badge */}
                                        <span
                                            className="ml-auto text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10 text-white/60">
            {st.priority}
        </span>
                                    </div>
                                ))}


                                {/* Add subtask */}
                                {!isNew && (<button
                                    onClick={() => handleAddSubtask(task.id)}
                                    className="flex items-center gap-2 text-sm mt-2 text-white/70 hover:text-white transition"
                                >
                                    <Plus size={16}/> Add subtask
                                </button>)}
                            </div>
                        </section>)}

                    {/* METADATA */}
                    {!isNew && (<section>
                        <h3 className="text-sm font-semibold text-white/70 mb-2">Details</h3>

                        <div className="space-y-3">
                            {/* Due Date */}
                            <div className="flex items-center gap-3 text-white/80">
                                <Calendar size={16}/>
                                <span>{task.dueDate ? task.dueDate : "No due date"}</span>
                            </div>

                            {/* Last Updated */}
                            <div className="flex items-center gap-3 text-white/80">
                                <Clock size={16}/>
                                <span>Updated recently</span>
                            </div>
                        </div>
                    </section>)}

                    {/* ACTIVITY */}
                    {!isNew && (
                        <section>
                            <h3 className="text-sm font-semibold text-white/70 mb-2">
                                Activity
                            </h3>

                            <div className="space-y-3 border-l border-white/20 pl-4">
                                {task.activity?.length ? (
                                    task.activity.map((evt: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 size={14} className="text-white/40"/>
                                            <p className="text-white/80 text-sm">{evt.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/40 italic text-sm">
                                        No activity yet.
                                    </p>
                                )}
                            </div>
                        </section>)}
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-white/10 flex justify-between">
                    {!isNew && (
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="
                            px-4 py-2 rounded-xl text-red-300
                            bg-red-500/20 border border-red-500/30
                            hover:bg-red-500/25 transition
                        "
                        >
                            Delete
                        </button>)}

                    {isNew ? (
                        <button
                            onClick={handleCreateTask}
                            disabled={!localTitle.trim()}
                            className={`
            px-6 py-2 rounded-xl text-white transition
            ${localTitle.trim()
                                ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                                : "bg-white/10 text-white/40 cursor-not-allowed"
                            }
        `}
                        >
                            Create Task
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveTask}
                            className="
            px-6 py-2 rounded-xl text-white
            bg-gradient-to-r from-[#15345C] to-[#112B4A]
            shadow-lg hover:opacity-90 transition
        "
                        >
                            Save Changes
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}

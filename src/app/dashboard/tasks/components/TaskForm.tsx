"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { useAuthStore } from "@/store/auth.store";

interface TaskFormProps {
    mode: "create" | "edit";
    task?: Task;
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    id: string;
    name: string;
    avatar: string;
}

/* ========================================================================
   CENTERED MODAL (CREATE TASK)
   ======================================================================== */
function CreateTaskModal({
                             isOpen,
                             onClose,
                             title,
                             setTitle,
                             description,
                             setDescription,
                             priority,
                             setPriority,
                             dueDate,
                             setDueDate,
                             assignedToId,
                             setAssignedToId,
                             openUserDropdown,
                             setOpenUserDropdown,
                             users,
                             handleCreate,
                             setError,
                             error
                         }: {
    isOpen: boolean;
    onClose: () => void;

    title: string;
    setTitle: (v: string) => void;

    description: string;
    setDescription: (v: string) => void;

    priority: TaskPriority;
    setPriority: (v: TaskPriority) => void;

    dueDate: string | null;
    setDueDate: (v: string | null) => void;

    assignedToId: string | null;
    setAssignedToId: (v: string | null) => void;

    openUserDropdown: boolean;
    setOpenUserDropdown: (v: boolean) => void;
    users: User[];
    handleCreate: () => void;
    error: string | null;
    setError: (v: string | null) => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div
                className="
                    w-full max-w-lg rounded-2xl p-6
                    bg-white/80 backdrop-blur-xl
                    border border-white/20 shadow-2xl
                    relative
                "
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-600 hover:text-black"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Create Task</h2>

                {/* FORM FIELDS */}
                <div className="space-y-4">
                    <div>
                        <label className="font-medium block mb-1">Title</label>
                        <input
                            className="w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => {
                                setError(null);
                                setTitle(e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Description</label>
                        <textarea
                            className="w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm"
                            placeholder="Task description"
                            rows={3}
                            value={description}
                            onChange={(e) => {
                                setError(null);
                                setDescription(e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Priority</label>
                        <div className="flex gap-2">
                            {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TaskPriority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`
                                        px-3 py-1 rounded-lg text-sm border
                                        bg-white/60 backdrop-blur-sm hover:bg-white/80
                                        ${p === priority ? "ring-2 ring-blue-400" : ""}
                                    `}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Due Date</label>
                        <input
                            type="date"
                            className="w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm"
                            value={dueDate ?? ""}
                            onChange={(e) => {
                                setError(null);
                                setDueDate(e.target.value || null);
                            }}
                        />
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Assigned To</label>

                        <div className="relative">
                            <div
                                onClick={() => setOpenUserDropdown(!openUserDropdown)}
                                className="
                                    w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm
                                    flex items-center justify-between cursor-pointer hover:bg-white/80
                                "
                            >
                                {assignedToId ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={users.find((u) => u.id === assignedToId)?.avatar}
                                            alt=""
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-gray-800">
                                            {users.find((u) => u.id === assignedToId)?.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 text-sm">Select a user</span>
                                )}
                            </div>

                            {openUserDropdown && (
                                <div
                                    className="
                                        absolute w-full mt-2 rounded-xl border bg-white/90 backdrop-blur-lg
                                        shadow-xl z-50
                                    "
                                >
                                    {users.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setAssignedToId(u.id);
                                                setOpenUserDropdown(false);
                                            }}
                                            className="
                                                flex items-center gap-3 p-2 cursor-pointer
                                                hover:bg-white/70 transition-all
                                            "
                                        >
                                            <img src={u.avatar} alt="" className="w-7 h-7 rounded-full" />
                                            <span className="text-gray-800">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ERROR BANNER */}
                {error && (
                    <div
                        className="
                            mt-4 px-4 py-3
                            bg-red-500/15 text-red-300
                            border border-red-500/30
                            rounded-xl backdrop-blur-sm
                            shadow-md animate-fadeIn
                        "
                    >
                        {error}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="
                            px-6 py-2 rounded-xl text-white
                            bg-gradient-to-r from-[#0A2A55] to-[#00AEEF]
                            shadow-md hover:opacity-90
                        "
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
   RIGHT-SLIDE PANEL (EDIT TASK)
   ======================================================================== */
function EditTaskPanel({
                           isOpen,
                           onClose,
                           task,

                           title,
                           setTitle,
                           description,
                           setDescription,
                           priority,
                           setPriority,
                           status,
                           setStatus,
                           dueDate,
                           setDueDate,
                           assignedToId,
                           setAssignedToId,
                           openUserDropdown,
                           setOpenUserDropdown,
                           users,
                           handleUpdate,
                           setError,
                           error
                       }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-[2px]">
            <div
                className="
                    w-[420px] md:w-[480px] h-full p-6
                    bg-gradient-to-b from-[#0A2A55]/95 to-[#001B33]/95
                    backdrop-blur-2xl
                    border-l border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.45)]
                    flex flex-col relative animate-slide-left text-slate-200
                "
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-gray-600 hover:text-black"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>

                {/* FORM FIELDS */}
                <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scroll">
                    <div>
                        <label className="font-medium block mb-1">Title</label>
                        <input
                            className="w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => {
                                setError(null);
                                setTitle(e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Description</label>
                        <textarea
                            className="w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm"
                            placeholder="Task description"
                            rows={3}
                            value={description}
                            onChange={(e) => {
                                setError(null);
                                setDescription(e.target.value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Priority</label>
                        <div className="flex gap-2">
                            {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TaskPriority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`
                                        px-3 py-1 rounded-lg text-sm border
                                        bg-white/60 backdrop-blur-sm hover:bg-white/80
                                        ${p === priority ? "ring-2 ring-blue-400" : ""}
                                    `}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Status</label>
                        <div className="flex gap-2">
                            {(["TODO", "IN_PROGRESS", "DONE", "ARCHIVED"] as TaskStatus[]).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setStatus(s)}
                                    className={`
                                        px-3 py-1 rounded-lg text-sm border
                                        bg-white/60 backdrop-blur-sm hover:bg-white/80
                                        ${s === status ? "ring-2 ring-blue-400" : ""}
                                    `}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="font-medium block mb-1">Assigned To</label>
                        <div className="relative">
                            <div
                                onClick={() => setOpenUserDropdown(!openUserDropdown)}
                                className="
                                    w-full rounded-xl border p-2 bg-white/60 backdrop-blur-sm
                                    flex items-center justify-between cursor-pointer hover:bg-white/80
                                "
                            >
                                {assignedToId ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={users.find((u) => u.id === assignedToId)?.avatar}
                                            alt=""
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-gray-800">
                                            {users.find((u) => u.id === assignedToId)?.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 text-sm">Select a user</span>
                                )}
                            </div>

                            {openUserDropdown && (
                                <div
                                    className="
                                        absolute w-full mt-2 rounded-xl border bg-white/90 backdrop-blur-lg
                                        shadow-xl z-50
                                    "
                                >
                                    {users.map((u) => (
                                        <div
                                            key={u.id}
                                            onClick={() => {
                                                setAssignedToId(u.id);
                                                setOpenUserDropdown(false);
                                            }}
                                            className="
                                                flex items-center gap-3 p-2 cursor-pointer
                                                hover:bg-white/70 transition-all
                                            "
                                        >
                                            <img src={u.avatar} alt="" className="w-7 h-7 rounded-full" />
                                            <span className="text-gray-800">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SUBTASKS PLACEHOLDER REMOVED — PHASE E REQUIREMENT */}
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div
                        className="
                            mt-4 px-4 py-3
                            bg-red-500/15 text-red-300
                            border border-red-500/30
                            rounded-xl backdrop-blur-sm
                            shadow-md animate-fadeIn
                        "
                    >
                        {error}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex justify-between mt-6">
                    <button
                        className="px-4 py-2 rounded-xl bg-red-200 hover:bg-red-300 text-red-800"
                        onClick={() => console.log("TODO DELETE")}
                    >
                        Delete
                    </button>

                    <button
                        onClick={handleUpdate}
                        className="
                            px-6 py-2 rounded-xl text-white
                            bg-gradient-to-r from-[#0A2A55] to-[#00AEEF]
                            shadow-md hover:opacity-90
                        "
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================================
   WRAPPER COMPONENT
   ======================================================================== */
export default function TaskForm({ mode, task, isOpen, onClose }: TaskFormProps) {
    //TASK STORE
    const createTask = useTaskStore((s) => s.createTask);
    const updateTask = useTaskStore((s) => s.updateTask);

    const userId = useAuthStore((s) => s.user?.id);

    //FORM STATES
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [dueDate, setDueDate] = useState<string | null>(null);
    const [assignedToId, setAssignedToId] = useState<string | null>(null);
    const [openUserDropdown, setOpenUserDropdown] = useState(false);
    const [groupId, setGroupId] = useState<string | null>(null);

    const [initialized, setInitialized] = useState(false);

    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (isOpen) setInitialized(false);
    }, [isOpen, mode, task?.id]);

    useEffect(() => {
        if (!isOpen) return;
        if (initialized) return;

        if (mode === "edit" && task) {
            setTitle(task.title);
            setDescription(task.description ?? "");
            setPriority(task.priority || "MEDIUM");
            setStatus(task.status || "TODO");
            setDueDate(task.dueDate ?? null);
            setAssignedToId(task.assignedToId ?? null);
            setInitialized(true);
            return;
        }

        // NEW TASK
        if (mode === "create") {
            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setStatus("TODO");
            setDueDate(null);
            setAssignedToId(null);
            setInitialized(true);
        }
    }, [initialized, isOpen, task]);

    function validateTask() {
        if (title.trim().length === 0) return "Title is required.";
        if (title.length > 100) return "Title cannot exceed 100 characters.";
        if (title.length < 4) return "Title must be at least 4 characters long.";

        if (description.length > 500) return "Description cannot exceed 500 characters.";

        if (dueDate) {
            const d = new Date(dueDate);
            if (d < new Date()) return "Due date cannot be in the past.";
        }

        return null;
    }

    function handleCreate() {
        const validationError = validateTask();
        if (validationError) return setError(validationError);

        createTask({
            title,
            description,
            priority,
            status: "TODO",
            dueDate,
            assignedToId,
            groupId,
            createdById: userId,
            parentId: null, // ROOT TASK → PHASE E requirement
        });

        console.log("Creating task:", { title, description, priority, dueDate, assignedToId });

        resetForm();
        onClose();
    }

    function handleUpdate() {
        const validationError = validateTask();
        if (validationError) return setError(validationError);

        if (!task?.id) return setError("No task selected to update.");

        console.log("Updating task:", task.id, { title, description, priority, status, dueDate, assignedToId });

        updateTask(task.id, {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedToId,
        });

        resetForm();
        onClose();
    }

    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setStatus("TODO");
        setDueDate(null);
        setAssignedToId(null);
        setError(null);
    }

    // MOCK USERS
    const mockUsers: User[] = [
        { id: "u1", name: "Omar Benaissa", avatar: "/avatars/omar.png" },
        { id: "u2", name: "Ilham Zer", avatar: "/avatars/ilham.png" },
        { id: "u3", name: "Junior Beagle", avatar: "/avatars/junior.png" }
    ];

    if (mode === "create")
        return (
            <CreateTaskModal
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                priority={priority}
                setPriority={setPriority}
                dueDate={dueDate}
                setDueDate={setDueDate}
                assignedToId={assignedToId}
                setAssignedToId={setAssignedToId}
                openUserDropdown={openUserDropdown}
                setOpenUserDropdown={setOpenUserDropdown}
                users={mockUsers}
                handleCreate={handleCreate}
                setError={setError}
                error={error}
            />
        );

    return (
        <EditTaskPanel
            isOpen={isOpen}
            onClose={onClose}
            task={task}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            status={status}
            setStatus={setStatus}
            dueDate={dueDate}
            setDueDate={setDueDate}
            assignedToId={assignedToId}
            setAssignedToId={setAssignedToId}
            openUserDropdown={openUserDropdown}
            setOpenUserDropdown={setOpenUserDropdown}
            users={mockUsers}
            handleUpdate={handleUpdate}
            setError={setError}
            error={error}
        />
    );
}

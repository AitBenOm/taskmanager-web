"use client";

import {useEffect, useState} from "react";
import {FlowColumn} from "./components/FlowColumn";
import {FlowCard} from "./components/FlowCard";
import FlowTaskModal from "./components/FlowTaskModal";
import {Button} from "@/components/ui/button";

const TASKS_PER_PAGE = 12;

const sortMethods: any = {
    TITLE_ASC: (a: any, b: any) => a.title.localeCompare(b.title),
    TITLE_DESC: (a: any, b: any) => b.title.localeCompare(a.title),
    DUE_ASC: (a: any, b: any) => new Date(a.due).getTime() - new Date(b.due).getTime(),
    DUE_DESC: (a: any, b: any) => new Date(b.due).getTime() - new Date(a.due).getTime(),
    PRIORITY_ASC: (a: any, b: any) =>
        ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(a.priority) -
        ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(b.priority),
    PRIORITY_DESC: (a: any, b: any) =>
        ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(b.priority) -
        ["LOW", "MEDIUM", "HIGH", "URGENT"].indexOf(a.priority),
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [view, setView] = useState<"list" | "kanban">(
        typeof window !== "undefined" && window.innerWidth < 640 ? "list" : "kanban"
    );

    const [page, setPage] = useState(1);
    const [filterPriority, setFilterPriority] = useState("ALL");

    const [hoveredTask, setHoveredTask] = useState<any | null>(null);
    const [previewPos, setPreviewPos] = useState({x: 0, y: 0});

    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [columnSort, setColumnSort] = useState({
        TODO: "TITLE_ASC",
        IN_PROGRESS: "TITLE_ASC",
        DONE: "TITLE_ASC",
    });

    useEffect(() => {
        fetch("/mock/mockTasks.json")
            .then((r) => r.json())
            .then((d) => setTasks(d));
    }, []);

    const filterTasks = (list: any[]) =>
        list.filter((t) => filterPriority === "ALL" || t.priority === filterPriority);

    const totalPages = Math.ceil(filterTasks(tasks).length / TASKS_PER_PAGE);

    const paginate = (list: any[]) => {
        const start = (page - 1) * TASKS_PER_PAGE;
        return list.slice(start, start + TASKS_PER_PAGE);
    };

    const getListTasks = () => paginate(filterTasks(tasks));

    const getColumnTasks = (status: string) => {
        const list = tasks.filter((t) => t.status === status);
        const filtered = filterTasks(list);
        const sorted = filtered.sort(sortMethods[columnSort[status]]);
        return paginate(sorted);
    };

    const handleHover = (task: any, e: any) => {
        setHoveredTask(task);
        setPreviewPos({x: e.clientX + 20, y: e.clientY + 20});
    };

    const openModal = (task: any) => {
        setSelectedTask(task);
        setModalOpen(true);
    };
    const priorityColors = {
        LOW: "border-blue-300 bg-blue-50",
        MEDIUM: "border-yellow-300 bg-yellow-50",
        HIGH: "border-orange-300 bg-orange-50",
        URGENT: "border-red-300 bg-red-50",
    };

    return (
        <main className="flex flex-col h-full space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

                <div className="flex items-center gap-3">
                    {/* View switcher */}
                    <div className="flex bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <button
                            onClick={() => setView("list")}
                            className={`px-4 py-2 text-sm ${
                                view === "list"
                                    ? "bg-white text-black font-semibold shadow-inner"
                                    : "text-gray-600 hover:text-black"
                            }`}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setView("kanban")}
                            className={`px-4 py-2 text-sm ${
                                view === "kanban"
                                    ? "bg-white text-black font-semibold shadow-inner"
                                    : "text-gray-600 hover:text-black"
                            }`}
                        >
                            Board
                        </button>
                    </div>

                    {/* Filter */}
                    <select
                        value={filterPriority}
                        onChange={(e) => {
                            setFilterPriority(e.target.value);
                            setPage(1);
                        }}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
                    >
                        {["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                            <option key={p} value={p}>
                                Priority: {p}
                            </option>
                        ))}
                    </select>

                    <Button className="rounded-full px-5 h-10 bg-blue-600 hover:bg-blue-700 text-white">
                        + New Task
                    </Button>
                </div>
            </div>

            {/* BODY CONTAINER (scrollable internally) */}
            <div className="flex-1 overflow-y-auto custom-scroll">

                {/* LIST MODE */}
                {view === "list" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pr-2 auto-rows-max">
                        {getListTasks().map((task) => (
                            <FlowCard
                                key={task.id}
                                {...task}

                                onClick={() => openModal(task)}
                            />
                        ))}
                    </div>
                )}

                {/* KANBAN MODE */}
                {view === "kanban" && (
                    <div
                        className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible pr-2 snap-x snap-mandatory">
                        {["TODO", "IN_PROGRESS", "DONE"].map((col) => (
                            <FlowColumn
                                key={col}
                                title={col === "TODO" ? "To Do" : col === "IN_PROGRESS" ? "In Progress" : "Done"}
                                tasksCount={getColumnTasks(col).length}
                                avatars={[{ name: "User", avatar: "/avatars/omar.png" }]}
                                status={col}           // <-- THE FIX
                                mobileWidth
                            >
                                {/* Sorting */}
                                <select
                                    value={columnSort[col]}
                                    onChange={(e) => setColumnSort({...columnSort, [col]: e.target.value})}
                                    className="w-full mb-3 rounded-lg border border-gray-300 text-sm py-1 px-2 bg-white shadow-sm"
                                >
                                    <option value="TITLE_ASC">Title A → Z</option>
                                    <option value="TITLE_DESC">Title Z → A</option>
                                    <option value="DUE_ASC">Due date ↑</option>
                                    <option value="DUE_DESC">Due date ↓</option>
                                    <option value="PRIORITY_ASC">Priority low → high</option>
                                    <option value="PRIORITY_DESC">Priority high → low</option>
                                </select>

                                {getColumnTasks(col).map((task) => (
                                    <FlowCard
                                        key={task.id}
                                        {...task}

                                        onClick={() => openModal(task)}
                                    />
                                ))}
                            </FlowColumn>
                        ))}
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-3 items-center pb-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <div className="flex gap-2">
                            {Array.from({length: totalPages}, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`px-3 py-2 rounded-lg border text-sm ${
                                        page === num
                                            ? "bg-blue-600 text-white border-blue-700"
                                            : "bg-white border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                        >
                            Next #15345c
                        </button>
                    </div>
                )}
            </div>


            {/* MODAL */}
            <FlowTaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={selectedTask}
                toggleSubtask={() => {
                }}
            />
        </main>
    );
}

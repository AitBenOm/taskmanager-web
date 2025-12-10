"use client";

import {useEffect, useState} from "react";
import {FlowColumn} from "./components/FlowColumn";
import {Button} from "@/components/ui/button";
import {TaskCard} from "@/app/dashboard/tasks/components/TaskCard";
import TaskInsightPanel from "@/app/dashboard/tasks/components/TaskInsightPanel";
import {useTaskStore} from "@/store/task-store";
import {useAuthStore} from "@/store/auth.store";

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
    const [view, setView] = useState<"list" | "kanban">(
        typeof window !== "undefined" && window.innerWidth < 640 ? "list" : "kanban"
    );
    const [page, setPage] = useState(1);


    const [filterPriority, setFilterPriority] = useState("ALL");
    const [selectedTask, setSelectedTask] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const user = useAuthStore((s) => s.user);

    const originalTasks = useTaskStore((s => s.tasks));
    const tasks = originalTasks.filter(t => {
        console.log("Filtering task:", t, "for user:", user);
        return t.createdById === user?.id || t?.assignedToId === (user?.id);
    });    const fetchTasks = useTaskStore((s => s.fetchTasks));


    const [columnSort, setColumnSort] = useState({
        TODO: "TITLE_ASC",
        IN_PROGRESS: "TITLE_ASC",
        DONE: "TITLE_ASC",
    });

    useEffect(() => {
        const newtasks = fetchTasks();
        console.log("Fetched tasks:", newtasks);
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

    const openModal = (task: any) => {
            setSelectedTask(task);
            setModalOpen(true);
        }
    ;
    const priorityColors = {
        LOW: "border-blue-300 bg-blue-50",
        MEDIUM: "border-yellow-300 bg-yellow-50",
        HIGH: "border-orange-300 bg-orange-50",
        URGENT: "border-red-300 bg-red-50",
    };

    const currentGroupId = "add8834b-022d-470c-b1b5-3b5928872787"; // TEMP for now
    return (
        <main className="flex flex-col h-full space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

                <div className="flex items-center gap-3">


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

                    <Button className="rounded-full px-5 h-10 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => openModal(null, "create")}
                    >
                        + New Task
                    </Button>
                </div>
            </div>

            {/* BODY CONTAINER (scrollable internally) */}
            <div className="flex-1 overflow-y-auto custom-scroll">

                {/* LIST MODE */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pr-2 auto-rows-max">
                        {getListTasks().map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => openModal(task, "edit")}
                            />))}
                    </div>


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
                            Next
                        </button>
                    </div>
                )}
            </div>
            <TaskInsightPanel
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={selectedTask}
                groupId={currentGroupId} // mock group until real ones
                users={[{id: "u1", name: "Omar", avatar: "/avatars/omar.png"}]} // mock user until real ones
            />

        </main>
    );
}

"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TaskService } from "@/services/task.service";
import {
    Task,
    TaskActivity,
    Subtask,
    CreateTaskDTO,
    UpdateTaskDTO,
    TaskStatus,
    TaskPriority,
} from "@/types/task";

import { useLoadingStore } from "@/store/loading-store";

interface TaskStore {
    // ======================
    // STATE
    // ======================
    tasks: Task[];
    activeTask: Task | null;

    statusFilter: TaskStatus | "ALL";
    priorityFilter: TaskPriority | "ALL";
    groupFilter: string | "ALL";
    search: string;

    // ======================
    // ACTIONS
    // ======================
    fetchTasks: () => Promise<void>;
    fetchTaskById: (id: string) => Promise<void>;
    createTask: (data: CreateTaskDTO) => Promise<Task>;
    updateTask: (id: string, data: UpdateTaskDTO) => Promise<Task>;
    deleteTask: (id: string) => Promise<void>;
    assignUser: (taskId: string, userId: string) => Promise<Task>;

    addSubtask: (taskId: string, text: string) => Promise<Subtask>;
    toggleSubtask: (
        taskId: string,
        subtaskId: string,
        done: boolean
    ) => Promise<Subtask>;

    loadActivity: (taskId: string) => Promise<TaskActivity[]>;
    refreshTaskActivity: (taskId: string) => Promise<void>;

    // ======================
    // UI ACTIONS
    // ======================
    setActiveTask: (id: string | null) => void;
    setFilter: (type: "status" | "priority" | "group", value: any) => void;
    setSearch: (query: string) => void;

    // ======================
    // HELPERS / SELECTORS
    // ======================
    getTasksByStatus: (status: TaskStatus) => Task[];
    getTasksByGroup: (groupId: string) => Task[];
    getAssignedToUser: (userId: string) => Task[];
    searchTasks: (query: string) => Task[];

    getCompletedSubtasksCount: (task: Task) => number;
    getProgress: (task: Task) => number;

    tasksTodo: Task[];
    tasksInProgress: Task[];
    tasksDone: Task[];
    tasksArchived: Task[];
}

export const useTaskStore = create<TaskStore>()(
    immer((set, get) => ({
        // ======================
        // INITIAL STATE
        // ======================
        tasks: [],
        activeTask: null,

        statusFilter: "ALL",
        priorityFilter: "ALL",
        groupFilter: "ALL",
        search: "",

        // ======================
        // FETCH ALL TASKS
        // ======================
        fetchTasks: async () => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const tasks = await TaskService.getTasks();
                set((state) => {
                    state.tasks = tasks;
                });
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // FETCH SINGLE TASK
        // ======================
        fetchTaskById: async (id: string) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const task = await TaskService.getTask(id);

                set((state) => {
                    // update activeTask
                    state.activeTask = task;

                    // update task inside tasks[]
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) state.tasks[index] = task;
                });
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // CREATE TASK
        // ======================
        createTask: async (data: CreateTaskDTO) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const newTask = await TaskService.createTask(data);

                set((state) => {
                    state.tasks.unshift(newTask);
                });

                return newTask;
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // UPDATE TASK
        // ======================
        updateTask: async (id, data) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const updated = await TaskService.updateTask(id, data);

                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === id);
                    if (index !== -1) state.tasks[index] = updated;

                    if (state.activeTask?.id === id) {
                        state.activeTask = updated;
                    }
                });

                return updated;
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // DELETE TASK
        // ======================
        deleteTask: async (id) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                await TaskService.deleteTask(id);

                set((state) => {
                    state.tasks = state.tasks.filter((t) => t.id !== id);
                    if (state.activeTask?.id === id) state.activeTask = null;
                });
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // ASSIGN USER
        // ======================
        assignUser: async (taskId, userId) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const updated = await TaskService.assignTask(taskId, userId);

                set((state) => {
                    const index = state.tasks.findIndex((t) => t.id === taskId);
                    if (index !== -1) state.tasks[index] = updated;

                    if (state.activeTask?.id === taskId) {
                        state.activeTask = updated;
                    }
                });

                return updated;
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // SUBTASKS
        // ======================
        addSubtask: async (taskId, text) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const subtask = await TaskService.addSubtask(taskId, text);

                set((state) => {
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (task) task.subtasks.push(subtask);

                    if (state.activeTask?.id === taskId) {
                        state.activeTask.subtasks.push(subtask);
                    }
                });

                return subtask;
            } finally {
                loading.setLoading(false);
            }
        },

        toggleSubtask: async (taskId, subtaskId, done) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const updated = await TaskService.toggleSubtask(taskId, subtaskId, done);

                set((state) => {
                    // Find the task
                    const task = state.tasks.find((t) => t.id === taskId);
                    if (task) {
                        const s = task.subtasks.find((st) => st.id === subtaskId);
                        if (s) s.done = updated.done;
                    }

                    // Update activeTask
                    if (state.activeTask?.id === taskId) {
                        const s = state.activeTask.subtasks.find((st) => st.id === subtaskId);
                        if (s) s.done = updated.done;
                    }
                });

                return updated;
            } finally {
                loading.setLoading(false);
            }
        },

        // ======================
        // ACTIVITY LOG
        // ======================
        loadActivity: async (taskId) => {
            const logs = await TaskService.getActivity(taskId);

            set((state) => {
                if (state.activeTask?.id === taskId) {
                    state.activeTask.logs = logs;
                }
            });

            return logs;
        },

        refreshTaskActivity: async (taskId) => {
            return get().loadActivity(taskId);
        },

        // ======================
        // UI ACTIONS
        // ======================
        setActiveTask: (id) => {
            if (!id) {
                set((state) => {
                    state.activeTask = null;
                });
                return;
            }

            const task = get().tasks.find((t) => t.id === id) || null;
            set((state) => {
                state.activeTask = task;
            });
        },

        setFilter: (type, value) => {
            set((state) => {
                if (type === "status") state.statusFilter = value;
                if (type === "priority") state.priorityFilter = value;
                if (type === "group") state.groupFilter = value;
            });
        },

        setSearch: (query) =>
            set((state) => {
                state.search = query;
            }),

        // ======================
        // HELPERS / SELECTORS
        // ======================
        getTasksByStatus: (status) => {
            return get().tasks.filter((t) => t.status === status);
        },

        getTasksByGroup: (groupId) => {
            return get().tasks.filter((t) => t.groupId === groupId);
        },

        getAssignedToUser: (userId: string) => {
            return get().tasks.filter((t) => t.assignedToId === userId);
        },

        searchTasks: (query: string) => {
            const q = query.toLowerCase();
            return get().tasks.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    (t.description ?? "").toLowerCase().includes(q)
            );
        },

        getCompletedSubtasksCount: (task) => {
            return task.subtasks.filter((s) => s.done).length;
        },

        getProgress: (task) => {
            if (task.subtasks.length === 0) return 0;
            const done = task.subtasks.filter((s) => s.done).length;
            return Math.round((done / task.subtasks.length) * 100);
        },

        tasksTodo: [],
        tasksInProgress: [],
        tasksDone: [],
        tasksArchived: [],
    }))
);

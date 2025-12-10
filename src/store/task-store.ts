"use client";

import {create} from "zustand";
import {TaskService} from "@/services/task.service";
import {CreateTaskDTO, Task, TaskActivity, TaskPriority, TaskStatus, UpdateTaskDTO,} from "@/types/task";

import {useLoadingStore} from "@/store/loading-store";
import {immer} from "zustand/middleware/immer";

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

    addSubtask: (taskParentId: string, subTask: CreateTaskDTO) => Promise<Task>;
    toggleSubtask: (
        taskId: string,
        subtaskId: string,
        done: boolean
    ) => Promise<Task>;

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

function removeTaskFromTree(tasks: Task[], taskId: string): Task[] {
    const newList = tasks.filter(t => t.id !== taskId).map(t => ({...t}));

    newList.forEach(t => {
        if (t.subtasks) {
            t.subtasks = removeTaskFromTree(t.subtasks, taskId);
        }
    });

    return newList;
}

function insertTaskAsSubtask(tasks: Task[], parentId: string, subtask: Task): Task[] {
    const newList = tasks.map(t => ({...t}));

    function recursiveInsert(list: Task[]): boolean {
        for (let item of list) {
            if (item.id === parentId) {
                if (!item.subtasks) item.subtasks = [];
                item.subtasks.unshift(subtask);
                return true;
            }
            if (item.subtasks && recursiveInsert(item.subtasks)) {
                return true;
            }
        }
        return false;
    }

    recursiveInsert(newList);
    return newList;
}


function updateTaskInTree(tasks: Task[], updated: Task): Task[] {
    const newList = tasks.map(task => ({...task}));

    function recursiveUpdate(list: Task[]): boolean {
        for (let i = 0; i < list.length; i++) {
            const t = list[i];

            // MATCH FOUND → UPDATE
            if (t.id === updated.id) {
                updated.subtasks = t.subtasks; // keep existing subtasks
                list[i] = updated;
                return true;
            }

            // Go deeper
            if (t.subtasks && recursiveUpdate(t.subtasks)) {
                return true;
            }
        }
        return false;
    }

    recursiveUpdate(newList);
    return newList;
}

function deleteTaskFromTree(tasks: Task[], taskId: string): Task[] {
    return tasks
        .filter(t => t.id !== taskId)
        .map(t => ({
            ...t,
            subtasks: t.subtasks ? deleteTaskFromTree(t.subtasks, taskId) : [],
        }));
}


function buildTaskTree(tasks: Task[]): Task[] {
    const map = new Map<string, Task>();
    const roots: Task[] = [];

    // STEP 1 — put all tasks in a map for quick access
    tasks.forEach(task => {
        map.set(task.id, {...task, subtasks: []});
    });

    // STEP 2 — link subtasks to parents
    map.forEach(task => {
        if (task.parentId) {
            const parent = map.get(task.parentId);
            if (parent) {
                parent.subtasks!.push(task);
            }
        } else {
            roots.push(task); // top-level task
        }
    });

    return roots;
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
                if (!tasks) throw new Error("Failed to fetch tasks");
                // Build task tree with subtasks
                const tree = buildTaskTree(tasks);
                set((state) => {
                    state.tasks = tree;
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
            console.log('Creating task with data:', data);
            try {
                const newTask = await TaskService.createTask(data);
                if (!newTask) throw new Error("Failed to create task");

                set((state) => {
                    const tasks = [...state.tasks];

                    // SUBTASK CASE
                    if (newTask.parentId) {
                        const parentIndex = tasks.findIndex(t => t.id === newTask.parentId);
                        if (parentIndex !== -1) {
                            if (!tasks[parentIndex].subtasks) {
                                tasks[parentIndex].subtasks = [];
                            }
                            tasks[parentIndex].subtasks!.unshift(newTask);
                        }
                    }

                    // NORMAL TASK CASE
                    else {
                        tasks.unshift(newTask);
                    }

                    state.tasks = tasks;
                });
                console.log('Creating task with data:', newTask);

                return newTask;
            } catch (error) {
                console.error('Error creating task:', error);
                throw error;
            } finally {
                loading.setLoading(false);
            }
        }
        ,

        // ======================
        // UPDATE TASK
        // ======================
        updateTask: async (taskId: string, data: UpdateTaskDTO) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const updatedTask = await TaskService.updateTask(taskId, data);
                if (!updatedTask) throw new Error("Failed to create task");

                set((state) => {
                    let tasks = [...state.tasks];

                    // CASE A: parentId changed → we MUST move task location
                    const oldTask = state.tasks.flatMap(t => [t, ...(t.subtasks || [])])
                        .find(t => t.id === taskId);

                    const parentChanged = oldTask && oldTask.parentId !== updatedTask.parentId;

                    if (parentChanged) {
                        // 1. Remove from old location
                        tasks = removeTaskFromTree(tasks, taskId);

                        // 2. NEW parent → move under parent
                        if (updatedTask.parentId) {
                            tasks = insertTaskAsSubtask(tasks, updatedTask.parentId, updatedTask);
                        }
                        // 3. No parent → becomes root task
                        else {
                            tasks.unshift(updatedTask);
                        }
                    }

                    // CASE B: parentId did NOT change → normal update
                    else {
                        tasks = updateTaskInTree(tasks, updatedTask);
                    }

                    state.tasks = tasks;
                });

                return updatedTask;
            } finally {
                loading.setLoading(false);
            }
        }
        ,

        // ======================
        // DELETE TASK
        // ======================
        deleteTask: async (id) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                await TaskService.deleteTask(id);

                set((state) => {
                    state.tasks = deleteTaskFromTree(state.tasks, id);
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
                if (!updated) throw new Error("Failed to create task");

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
        addSubtask: async (taskParentId, subTask: CreateTaskDTO) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            try {
                const subtask = await TaskService.addSubtask(taskParentId, subTask);
                if (!subtask) throw new Error("Failed to create task");

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
            const list = task.subtasks ?? [];
            return list.filter((s) => s.status === "DONE").length;
        },

        getProgress: (task) => {
            const list = task.subtasks ?? [];
            if (list.length === 0) return 0;

            const done = list.filter((s) => s.status === "DONE").length;
            return Math.round((done / list.length) * 100);
        },

        tasksTodo: [],
        tasksInProgress: [],
        tasksDone: [],
        tasksArchived: [],
    }))
);

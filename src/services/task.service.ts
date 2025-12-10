import {CreateTaskDTO, Task, TaskActivity, UpdateTaskDTO,} from "@/types/task";
import {safeGet, safePatch, safePost} from "@/lib/api/helpers";

const BASE = "/tasks";

// ------------------------------
// Internal helpers
// ------------------------------

function ensureId(id: string) {
    if (!id || typeof id !== "string") {
        throw new Error("TaskService Error: Missing or invalid ID.");
    }
    return id;
}

function ensureText(text: string) {
    if (!text?.trim()) {
        throw new Error("TaskService Error: Subtask text cannot be empty.");
    }
    return text.trim();
}

// ------------------------------
// FINAL PRODUCTION TASK SERVICE
// ------------------------------

export const TaskService = {
    //
    // TASK CRUD
    //

    async getTasks(): Promise<Task[] | undefined> {
        return (safeGet<Task[]>(`${BASE}`)).then((response) => {
            return response?.data;
        });
    },

    async getTask(id: string): Promise<Task | undefined> {
        return (safeGet<Task>(`${BASE}/${ensureId(id)}`)).then((response) => {
            return response?.data;
        });
    },

    async createTask(data: CreateTaskDTO): Promise<Task | undefined> {
        return (safePost<Task>(`${BASE}`, data)).then((response) => {
            return response?.data;
        });
    },

    async updateTask(id: string, data: UpdateTaskDTO): Promise<Task | undefined> {
        return (safePatch<Task>(`${BASE}/${ensureId(id)}`, data)).then((response) => {
            return response?.data;
        });
    },


    //
    // ASSIGNMENT
    //

    async assignTask(taskId: string, userId: string): Promise<Task | undefined> {
        if (!userId) throw new Error("TaskService Error: Missing userId.");
        return (safePatch<Task>(`${BASE}/${ensureId(taskId)}/assign`, {userId})).then((response) => {
            return response?.data;
        });
    },

    //
    // SUBTASKS
    //

    async addSubtask(taskParentId: string, subTask: CreateTaskDTO): Promise<Task | undefined> {
        return (safePost<Task>(`${BASE}/${ensureId(taskParentId)}/subtasks`, subTask)).then((response) => {
            return response?.data;
        });
    },

    async toggleSubtask(
        taskId: string,
        subtaskId: string,
        done: boolean
    ): Promise<Task | undefined> {
        return (safePatch<Task>(`${BASE}/${ensureId(taskId)}/subtasks/${ensureId(subtaskId)}`, {done})).then((response) => {
            return response?.data;
        });
    },

    //
    // ACTIVITY LOG
    //

    async getActivity(taskId: string): Promise<TaskActivity[] | undefined> {
        return (safeGet<TaskActivity[]>(`${BASE}/${ensureId(taskId)}/activity`)).then((response) => {
            return response?.data;
        });
    },
};

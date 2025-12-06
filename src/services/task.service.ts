import {
    Task,
    CreateTaskDTO,
    UpdateTaskDTO,
    Subtask,
    TaskActivity,
} from "@/types/task";
import {apiGet, apiPost, apiPatch, apiDelete} from "@/lib/api/api";

const BASE = "/api/tasks";

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

    async getTasks(): Promise<Task[]> {
        return apiGet<Task[]>(`${BASE}`);
    },

    async getTask(id: string): Promise<Task> {
        return apiGet<Task>(`${BASE}/${ensureId(id)}`);
    },

    async createTask(data: CreateTaskDTO): Promise<Task> {
        return apiPost<Task>(`${BASE}`, data);
    },

    async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
        return apiPatch<Task>(`${BASE}/${ensureId(id)}`, data);
    },

    async deleteTask(id: string): Promise<{ success: boolean }> {
        return apiDelete(`${BASE}/${ensureId(id)}`);
    },

    //
    // ASSIGNMENT
    //

    async assignTask(taskId: string, userId: string): Promise<Task> {
        if (!userId) throw new Error("TaskService Error: Missing userId.");
        return apiPatch<Task>(`${BASE}/${ensureId(taskId)}/assign`, { userId });
    },

    //
    // SUBTASKS
    //

    async addSubtask(taskId: string, text: string): Promise<Subtask> {
        return apiPost<Subtask>(`${BASE}/${ensureId(taskId)}/subtasks`, {
            text: ensureText(text),
        });
    },

    async toggleSubtask(
        taskId: string,
        subtaskId: string,
        done: boolean
    ): Promise<Subtask> {
        return apiPatch<Subtask>(
            `${BASE}/${ensureId(taskId)}/subtasks/${ensureId(subtaskId)}`,
            { done }
        );
    },

    //
    // ACTIVITY LOG
    //

    async getActivity(taskId: string): Promise<TaskActivity[]> {
        return apiGet<TaskActivity[]>(`${BASE}/${ensureId(taskId)}/activity`);
    },
};

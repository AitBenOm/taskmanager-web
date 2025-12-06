export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Subtask {
    id: string;
    text: string;
    done: boolean;
}

export interface Task {
    id: string;
    title: string;
    description?: string;

    status: TaskStatus;
    priority: TaskPriority;

    createdAt?: string;
    updatedAt?: string;
    dueDate?: string | null;

    groupId: string;
    createdById: string;
    assignedToId?: string | null;

    parentId?: string | null;
    subtasks: Subtask[];

    logs?: TaskActivity[];
}

export interface TaskActivity {
    id: string;
    action: string;
    metadata?: any;
    createdAt: string;

    user: {
        id: string;
        fullName: string;
        avatarUrl?: string;
    };
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    groupId: string;
    priority?: TaskPriority;
    dueDate?: string | null;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    assignedToId?: string | null;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";


export interface UserMinimal {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;

    status: TaskStatus;
    priority: TaskPriority;

    dueDate?: string | null;
    createdAt: string;
    updatedAt: string;

    groupId: string;

    createdById: string;
    assignedToId?: string | null;

    /** ⭐ SELF RELATION */
    parentId?: string | null;
    subtasks?: Task[];            // recursive

    /** Optional extras from backend */
    assignedTo?: {
        id: string;
        fullName: string;
        avatarUrl?: string | null;
    } | null;
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
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string | null;
    assignedToId?: string | null;
    createdById?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;

    groupId: string | null;

    /** ⭐ self relation */
    parentId?: string | null;
}


export interface UpdateTaskDTO {
    title?: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: TaskStatus;
    dueDate?: string | null;
    assignedToId?: string | null;

    /** ⭐ self relation */
    parentId?: string | null;
}

export interface QueryTaskDto {
    groupId?: string;
    userId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
    dueDate?: string;
    parentId?: string | null;   // ⭐ for root tasks / subtasks
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "dueDate" | "priority" | "status";
    order?: "asc" | "desc";
}



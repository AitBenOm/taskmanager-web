// ================================================
// WORKSPACE DTOs — Matching Prisma + Frontend Style
// ================================================

import {Task, UpdateTaskDTO} from "@/types/task";

export interface Workspace {
    id: string;
    name: string;
    description: string;
    iconUrl?: string | null;
    ownerId: string;
    createdAt: string;  // ISO date
    updatedAt: string;  // ISO date
}

export interface WorkspaceFullDTO {
    id: string;
    name: string;
    description?: string | null;
    ownerId: string;
    inviteCode?: string | null;
    createdAt: string;
    updatedAt: string;

    groups: WorkspaceGroupDTO[];
    members: memberDTO[];
}

// Group object (basic for now)
export interface WorkspaceGroupDTO {
    id: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    createdAt: string;
    updatedAt: string;
    tasks: UpdateTaskDTO[];
}

// CREATE WORKSPACE DTO
export interface CreateWorkspaceDTO {
    name: string;
    description: string;
    iconUrl?: string | null;
}

// UPDATE WORKSPACE DTO
export interface UpdateWorkspaceDTO {
    name?: string;    description?: string;
    iconUrl?: string | null;
}

// RESPONSE DTO — BASIC WORKSPACE
export interface WorkspaceDTO {
    id: string;
    name: string;    description: string;

    iconUrl?: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
}

// WORKSPACE MEMBER DTO
export interface memberDTO {
    id: string;
    userId: string;
    workspaceId: string;
    groupId: string;
    role: WorkspaceRoleDTO;
    joinedAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl?: string | null;
    };
}

// ENUMS
export type WorkspaceRoleDTO = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

// WORKSPACE LIST ITEM (used in Admin Page)
export interface WorkspaceListItemDTO {
    workspace: WorkspaceDTO;
    role: WorkspaceRoleDTO;
    memberCount: number;
    groupCount: number;
    taskCount: number;
}

// WORKSPACE STATS DTO
export interface WorkspaceStatsDTO {
    totalMembers: number;
    totalGroups: number;
    totalTasks: number;
}

// WORKSPACE ACTIVITY DTO
export interface WorkspaceActivityDTO {
    id: string;
    action: string;
    timestamp: string;
    userId: string;
    taskId?: string | null;
    groupId?: string | null;
}

// WORKSPACE CONTEXT — FULL WORKSPACE PAGE PAYLOAD
export interface WorkspaceContextDTO {
    workspace: WorkspaceDTO;
    members: memberDTO[];
    groups: GroupDTO[];
    stats: WorkspaceStatsDTO;
    activity: WorkspaceActivityDTO[];
}

// GROUP DTO (used in WorkspaceContext)
export interface GroupDTO {
    id: string;
    name: string;
    type: GroupTypeDTO;
    description?: string | null;
    members?: memberDTO[];
    tasks?: Task[];
    iconUrl?: string | null;
    ownerId: string;
    workspaceId?: string | null;
    createdAt: string;
    updatedAt: string;
}

// GROUP TYPE ENUM
export type GroupTypeDTO =
    | "FAMILY"
    | "FRIENDS"
    | "ROOMMATES"
    | "NEIGHBORS"
    | "TEAM"
    | "DEPARTMENT"
    | "PROJECT"
    | "CLASS"
    | "CLUB"
    | "ASSOCIATION"
    | "SPORTS"
    | "COMMUNITY"
    | "EVENT"
    | "WORK"
    | "OTHER";

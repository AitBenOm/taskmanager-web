import {memberDTO, WorkspaceRoleDTO} from "@/types/workspace";
import {Task} from "@/types/task";

enum GroupRole {
    OWNER,
    ADMIN,
    MEMBER
}

export enum GroupType {
    FAMILY,
    FRIENDS,
    ROOMMATES,
    NEIGHBORS,
    TEAM,
    DEPARTMENT,
    PROJECT,
    CLASS,
    CLUB,
    ASSOCIATION,
    SPORTS,
    COMMUNITY,
    EVENT,
    WORK,
    OTHER
}

export interface GroupFullDTO {
    id: string;
    name: string;
    description?: string | null;
    type: GroupType;
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
    members: memberDTO[];
}

export interface GroupMemberDTO {
    id: string;
    userId: string;
    groupId: string;
    role: GroupRole;
    joinedAt: string;
    invitedBy: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        avatarUrl?: string | null;
    };
}


export type UserContext = {
    id: string;
    fullName: string;
    email: string;
};

export type WorkspaceMembership = {
    workspaceId: string;
    workspaceName: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
};

export type GroupMembership = {
    groupId: string;
    groupName: string;
    workspaceId: string;
    role: "ADMIN" | "MEMBER";
};

// This is the main input structure for the role manager
export type SidebarRoleManagerInput = {
    user: UserContext;
    workspaces: WorkspaceMembership[];
    groups: GroupMembership[];
};

// ----------------------------------------------------
// A.3 — SidebarRoleManager Output Definitions
// ----------------------------------------------------

export type SidebarMode =
    | "OWNER_MODE"
    | "ADMIN_MODE"
    | "MEMBER_MODE";

export type SidebarRoleManagerOutput = {
    mode: SidebarMode;

    // Visibility rules
    showWorkspaces: boolean;
    showGroups: boolean;
    showAdmin: boolean;

    // Lists to render in sidebar
    workspaceList: WorkspaceMembership[];
    groupList: GroupMembership[];
};

function evaluateSidebarMode(
    workspaces: WorkspaceMembership[]
): SidebarMode {
    // If user is OWNER anywhere
    const isOwner = workspaces.some(ws => ws.role === "OWNER");
    if (isOwner) return "OWNER_MODE";

    // Else if user is ADMIN anywhere
    const isAdmin = workspaces.some(ws => ws.role === "ADMIN");
    if (isAdmin) return "ADMIN_MODE";

    // Else default to MEMBER
    return "MEMBER_MODE";
}

// ----------------------------------------------------
// A.5 — Sidebar Visibility Logic Based on Mode
// ----------------------------------------------------

function computeSidebarVisibility(mode: SidebarMode) {
    switch (mode) {
        case "OWNER_MODE":
            return {
                showWorkspaces: true,
                showGroups: true,
                showAdmin: true,
            };

        case "ADMIN_MODE":
            return {
                showWorkspaces: true,
                showGroups: true,
                showAdmin: false,
            };

        case "MEMBER_MODE":
        default:
            return {
                showWorkspaces: false,
                showGroups: true,
                showAdmin: false,
            };
    }
}

// ----------------------------------------------------
// A.6 — Final Assembly: Build Sidebar Role Context
// ----------------------------------------------------

export function computeSidebarRoleContext(
    input: SidebarRoleManagerInput
): SidebarRoleManagerOutput {
    const { user, workspaces, groups } = input;

    // 1. Compute global role mode
    const mode = evaluateSidebarMode(workspaces);

    // 2. Determine what sections are visible
    const visibility = computeSidebarVisibility(mode);

    // 3. Filter or reshape lists if needed (enterprise style)
    const workspaceList = visibility.showWorkspaces ? workspaces : [];
    const groupList = visibility.showGroups ? groups : [];

    // 4. Return final context object consumed by Sidebar + Navigation Store
    return {
        mode,

        showWorkspaces: visibility.showWorkspaces,
        showGroups: visibility.showGroups,
        showAdmin: visibility.showAdmin,

        workspaceList,
        groupList,
    };
}




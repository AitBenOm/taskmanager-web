"use client";

import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {
    computeSidebarRoleContext,
    SidebarRoleManagerInput,
    SidebarRoleManagerOutput
} from "@/lib/navigation/SidebarRoleManager";
import {useLoadingStore} from "@/store/loading-store";
import {useErrorStore} from "@/store/error-store";
import {NavigationService} from "@/services/novigation.service";

interface navigationState {
    sidebarContext: SidebarRoleManagerOutput | null;

    // Active navigation layers
    activeWorkspace: string | null;
    activeGroup: string | null;
    activeTask: string | null;

    // Loading state for initializing navigation
    isLoading: boolean;
    error: string | null;

    // Actions
    setSidebarContext: (ctx: SidebarRoleManagerOutput) => void;

    setActiveWorkspace: (workspaceId: string | null) => void;
    setActiveGroup: (groupId: string | null) => void;
    setActiveTask: (taskId: string | null) => void;

    resetGroupAndTask: () => void;
    resetTask: () => void;

    // Initialization
    loadNavigationContext: (userId: string | undefined) => Promise<void>;


}

export const useNavigationStore = create<navigationState>()(
    immer((set, get) => ({

        setActiveWorkspace: (workspaceId: string | null) => {
            set((state) => {
                state.activeWorkspace = workspaceId;
            });
        },
        setActiveGroup: (groupId: string | null) => {
            set((state) => {
                state.activeGroup = groupId;
            });
        },
        setActiveTask: (taskId: string | null) => {
            set((state) => {
                state.activeTask = taskId;
            });
        },
        resetGroupAndTask: () => {
            set((state) => {
                state.activeGroup = null;
                state.activeTask = null;
            });
        },
        resetTask: () => {
            set((state) => {
                state.activeTask = null;
            });
        },

        sidebarContext: null,
        activeWorkspace: null,
        activeGroup: null,
        activeTask: null,
        isLoading: false,
        error: null,

        setSidebarContext: (ctx: SidebarRoleManagerOutput) => {
            set((state) => {
                state.sidebarContext = ctx;
            });
        },
        loadNavigationContext: async (userId: string) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);

            const error = useErrorStore.getState();
            error.setError(null);
            try {
                // 1. Fetch user's navigation data from backend
                const data: SidebarRoleManagerInput = await NavigationService.getNavigationContext(userId);

                // 2. Compute sidebar context using our enterprise logic
                const context = computeSidebarRoleContext(data);

                // 3. Save in store
                set({
                    sidebarContext: context,
                    isLoading: false,
                    error: null,
                });
            } catch (err: any) {
                console.error("Navigation context error:", err);

                set({
                    isLoading: false,
                    error: err.message || "Failed to load navigation context",
                });
            }
        }
    })))
;


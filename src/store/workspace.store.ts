"use client"

import {CreateWorkspaceDTO, Workspace, WorkspaceFullDTO} from "@/types/workspace";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {useLoadingStore} from "@/store/loading-store";
import {WorkspaceService} from "@/services/workspace.service";

interface WorkspaceStore {
    workspaces: WorkspaceFullDTO[];
    activeWorkspace?: WorkspaceFullDTO;
    selectedWorkspace?: WorkspaceFullDTO;
    createWorkspace: (ws: CreateWorkspaceDTO) => Promise<Workspace>;
    fetchWorkspaces: () => Promise<WorkspaceFullDTO[]>;
    fetchWorkspaceById: (id: string | undefined) => Promise<WorkspaceFullDTO | undefined>;
    deleteWorkspace: (id: string) => void;
    updateWorkspace: (id: string) => void;
    setSelectedWorkspace: (ws: WorkspaceFullDTO) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
    immer((set, get) => ({
        workspaces: [],

        createWorkspace: async (data: CreateWorkspaceDTO) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);
            try {
                const newWs = await WorkspaceService.createWorkspace(data);
                if (!newWs) throw new Error("Failed to create task");

                set((state) => {
                    const workspaces = [...state.workspaces];
                    workspaces.unshift(newWs);
                    state.workspaces = workspaces;
                });
                return newWs;
            } catch (error) {
                console.error('Error creating task:', error);
                throw error;
            } finally {
                loading.setLoading(false);
            }

        },
        fetchWorkspaces: async () => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true);
            try {
                const workspaces = await WorkspaceService.getWorkspaces();
                if (!workspaces) throw new Error("Failed to fetch workspaces");
                set((state) => {
                    state.workspaces = [...workspaces];

                })
                return workspaces;
            } finally {
                loading.setLoading(false);
            }

        },
        setSelectedWorkspace: (ws: WorkspaceFullDTO) => {
            set((state) => {
                state.selectedWorkspace = ws;
            });
        },
        fetchWorkspaceById: async (id: string) => {
            const loading = useLoadingStore.getState();
            loading.setLoading(true)
            const workspace = await WorkspaceService.getWorkspaceById(id);
            set((state) => {
                state.activeWorkspace = workspace;
            });
        },

        updateWorkspace: () => {
        },
        deleteWorkspace: () => {
        }
    })));
"use client";
import {create} from "zustand";

interface UiStore {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebar: (value: boolean) => void;

    sectionState?: Record<string, boolean>;
    toggleSection?: (section: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () =>
        set((s) => ({sidebarCollapsed: !s.sidebarCollapsed})),
    setSidebar: (value) => set({sidebarCollapsed: value}),

    sectionState: {
        WORKSPACE: true,
        PRODUCTIVITY: true,
        ACCOUNT: true,
    },
    toggleSection: (section) =>
        set((s) => ({
            sectionState: {
                ...s.sectionState,
                [section]: !s.sectionState?.[section],
            },
        })),
}));

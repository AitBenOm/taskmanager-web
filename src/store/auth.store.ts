"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
    familyId?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            setToken: (token) =>
                set({
                    token,
                    isAuthenticated: !!token,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),

        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hasHydrated = true;
                }
            },
        }
    )
);

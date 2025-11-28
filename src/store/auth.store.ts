"use client";

import {User} from "@/types/user";
import {create} from "zustand";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;

    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    clearAuth: () => void;
}
export const useAuthStore = create<AuthState>()(

        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            setToken: (token) => set({token}),
            setUser: (user) => set({user}),
            setIsAuthenticated: (isAuthenticated) => set({isAuthenticated}),
            clearAuth: () => set({token: null, user: null, isAuthenticated: false}),
        })
    );

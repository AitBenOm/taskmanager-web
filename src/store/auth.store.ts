// src/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
    _hasHydrated: boolean;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
    setHasHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // state
            user: null,
            token: null,
            _hasHydrated: false,

            // actions
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            logout: () => set({ user: null, token: null }),
            setHasHydrated: (v) => set({ _hasHydrated: v }),
        }),
        {
            name: "auth-store",
            onRehydrateStorage: () => (state) => {
                // after rehydrate, mark the store as hydrated if action exists
                if (state) {
                    const maybe = state as unknown as { setHasHydrated?: (b: boolean) => void };
                    maybe.setHasHydrated?.(true);
                }
            },
        }
    )
);
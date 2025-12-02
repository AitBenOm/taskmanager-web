import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            //
            // USER SESSION
            //
            user: null,     // { id, fullName, email, avatarUrl, role, familyId, ... }
            token: null,
            _hasHydrated: false,

            //
            // GLOBAL UPDATE FLAG (G.3.5)
            //
            _updated: false,

            //
            // SET USER (with merge + update event)
            //
            setUser: (data: any) => {
                const current = get().user;

                // Merge user fields instead of overwriting
                const merged = {
                    ...current,
                    ...data,
                };

                set({
                    user: merged,
                    _updated: true,    // 🔥 trigger global animations everywhere
                });

                // Reset the animation flag after 500ms
                setTimeout(() => {
                    set({ _updated: false });
                }, 500);
            },

            //
            // SET TOKEN
            //
            setToken: (token) => set({ token }),

            //
            // LOGOUT
            //
            logout: () => {
                set({
                    user: null,
                    token: null,
                });
            },

            //
            // HYDRATION CHECK
            //
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),

        {
            name: "auth-store",
            onRehydrateStorage: () => (state) => {
                if (state) state.setHasHydrated(true);
            },
        }
    )
);

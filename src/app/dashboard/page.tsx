"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/loading-store";
import { safeGet } from "@/lib/api/helpers";
import {useAuthStore} from "@/store/auth.store";

export default function DashboardPage() {
    const { token, user, setUser, _hasHydrated } = useAuthStore();
    const setLoading = useLoadingStore((s) => s.setLoading);
    const router = useRouter();

    // 🚨 1. Don't render anything before hydration


    useEffect(() => {
        const loadAndRedirect = async () => {
            // 🚨 2. If no token → redirect to login
            if (!token) {
                router.push("/auth/login");
                return;
            }

            // 🚨 3. Fetch user only if necessary
            if (!user) {
                setLoading(true);

                const response = await safeGet("/users/profile");
                if (response) setUser(response.data);

                setLoading(false);
            }

            // 🚨 4. Redirect after data is ready
            router.push("/dashboard/profile");
        };

        loadAndRedirect();
    }, [token, user, router, setUser, setLoading]);

    return null;
}

import axios from "axios";
import { useLoadingStore } from "@/store/loading-store";
import {useAuthStore} from "@/store/auth.store";
import {useErrorStore} from "@/store/error-store";
import {toast} from "sonner";

const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

// =============================
// 🔥 REQUEST INTERCEPTOR
// =============================
api.interceptors.request.use(
    (config) => {
        // Only show loader for meaningful API calls
        const shouldShowLoader =
            config.method !== "get" || !config.url?.startsWith("/auth");

        if (shouldShowLoader) {
            useLoadingStore.getState().setLoading(true);
        }

        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        useLoadingStore.getState().setLoading(false);
        return Promise.reject(error);
    }
);

// =============================
// 🔥 RESPONSE INTERCEPTOR
// =============================
api.interceptors.response.use(
    (response) => {
        useLoadingStore.getState().setLoading(false);
        return response;
    },

    async (error) => {
        useLoadingStore.getState().setLoading(false); // stops loader even on error

        const originalRequest = error.config;
        const message =
            error.response?.data?.message ||
            "Unexpected error. Please try again.";

        useErrorStore.getState().setError(message);

        toast.error(message, {
            duration: 3000,
        });
        // If unauthorized → attempt refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = await api.post("/auth/refresh");
                const newToken = refresh.data.access_token;

                useAuthStore.getState().setToken(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

import axios, {AxiosError} from "axios"
import {handleError} from "@/lib/error-handler";
import {useLoadingStore} from "@/store/loading-store";
import {useAuthStore} from "@/store/auth.store";

// Temporary in-memory access token.
// This will be managed by Zustand in G.5.
let accessToken: string | null = null
let isRefreshing = false
let failedQueue: any[] = []


export const setToken = (token: string | null) => {
    accessToken = token
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend URL
    withCredentials: true, // needed for refresh token cookie
})


/**
 * 1) REQUEST INTERCEPTOR
 * Inject the access token in every request.
 */


api.interceptors.request.use((config) => {

    useLoadingStore.getState().setLoading(true);
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.withCredentials = true;
    return config;
})


api.interceptors.response.use(
    // SUCCESS: return the response
    (response) => response,

    // ERROR: attempt refresh if needed
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // If 401, try refresh (only once)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token (cookie-based)
                const refresh = await api.post(
                    "/auth/refresh",
                    {},
                    {withCredentials: true}
                );

                const newToken = refresh.data.access_token;

                // Save token in memory
                setToken(newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                useLoadingStore.getState().setLoading(false);
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed — user must re-login
                setToken(null);
                useAuthStore.getState().setUser(null);
                useLoadingStore.getState().setLoading(false);
                return Promise.reject(refreshError);
            }
        }

        // Other errors
        return Promise.reject(error);
    }
);


/**
 * 2) RESPONSE INTERCEPTOR (Prepare for G.2)
 * If backend returns 401 because token expired:
 * - In G.2 we will automatically refresh the token
 * - Then retry the original request
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // We will complete this logic in G.2.
        const normalized = handleError(error);
        return Promise.reject(normalized)
    }
)

export default api

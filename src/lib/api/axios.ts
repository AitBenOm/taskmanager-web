import axios from "axios"

// Temporary in-memory access token.
// This will be managed by Zustand in G.5.
let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
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
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

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
        return Promise.reject(error)
    }
)

export default api

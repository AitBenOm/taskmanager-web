/**
 * Universal API wrapper for all HTTP requests.
 * Used throughout the entire TaskManager frontend.
 *
 * - Automatically parses JSON
 * - Throws typed errors
 * - Includes cookies for authentication
 * - Centralizes headers & fetch configuration
 */

export async function api<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        credentials: "include", // allow JWT cookie auth
    });

    // Handle non-OK responses
    if (!response.ok) {
        let message = `API Error ${response.status}`;

        try {
            const text = await response.text();
            message = `API Error ${response.status}: ${text}`;
        } catch (e) {
            // ignore parsing error
        }

        throw new Error(message);
    }

    // Automatically parse JSON or return empty object for 204
    try {
        return (await response.json()) as T;
    } catch {
        return {} as T;
    }
}

/**
 * Helper methods for convenience if you want them.
 * Not required, but many teams use these.
 */

export const apiGet = <T>(url: string) => api<T>(url);

export const apiPost = <T>(url: string, body?: any) =>
    api<T>(url, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    });

export const apiPatch = <T>(url: string, body?: any) =>
    api<T>(url, {
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
    });

export const apiDelete = <T>(url: string) =>
    api<T>(url, {
        method: "DELETE",
    });

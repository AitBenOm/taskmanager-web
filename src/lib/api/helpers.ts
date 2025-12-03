import api from "./axios";
import type { ApiResponse } from "@/types/api";

export async function safeGet<T>(url: string): Promise<ApiResponse<T> | null> {
    try {
        const res = await api.get(url);
        return { success: true, data: res.data };
    } catch (err) {
        console.error("GET ERROR:", err);
        return null;
    }
}

export async function safePost<T>(url: string, body: any): Promise<ApiResponse<T> | null> {
    try {
        const res = await api.post(url, body);
        return { success: true, data: res.data };
    } catch (err) {
        console.error("POST ERROR:", err);
        return null;
    }
}

export async function safePatch<T>(url: string, body: any): Promise<ApiResponse<T> | null> {
    try {
        const res = await api.patch(url, body);
        return { success: true, data: res.data };
    } catch (err) {
        console.error("PATCH ERROR:", err);
        return null;
    }
}

export function extractErrorMessage(error: any): string {
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "An unexpected error occurred.";
}

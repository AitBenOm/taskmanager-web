"use client";

import { create } from "zustand";

interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastState {
    toasts: Toast[];
    showToast: (message: string, type?: "success" | "error" | "info") => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],

    showToast: (message, type = "info") =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { id: Math.random().toString(), message, type },
            ],
        })),

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));

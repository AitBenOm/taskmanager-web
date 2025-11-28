"use client";

import { useLoadingStore } from "@/store/loading-store";

export default function LoadingOverlay() {
    const isLoading = useLoadingStore((s: { isLoading: never; }) => s.isLoading);

    if (!isLoading) return null;

    return (
        <div className="
      fixed inset-0
      bg-black/20 backdrop-blur-sm
      flex items-center justify-center
      z-50
    ">
            <div className="bg-white shadow-lg rounded-xl px-6 py-4 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-[#A78BFA] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

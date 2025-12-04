"use client";

interface FlowPreviewProps {
    title: string;
    description?: string;
    priority: string;
    progress: number;
}

export function FlowPreview({ title, description, priority, progress }: FlowPreviewProps) {
    const priorityColors: any = {
        LOW: "#a3a3a3",
        MEDIUM: "#3b82f6",
        HIGH: "#eab308",
        URGENT: "#ef4444",
    };

    return (
        <div
            className="
        absolute z-50 p-4 w-72
        bg-white rounded-xl shadow-2xl border border-gray-200
        animate-fadeIn pointer-events-none
      "
        >
            {/* Priority line */}
            <div
                className="h-[3px] w-full rounded-full mb-3"
                style={{ backgroundColor: priorityColors[priority] }}
            />

            <p className="font-semibold text-gray-900">{title}</p>

            {description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

"use client";

export default function DropIndicator({ active, over }) {
    if (!active || !over) return null;

    // Only show when dragging over a task inside a column
    if (over.data?.current?.type !== "task") return null;

    return (
        <div className="h-3 w-full rounded bg-blue-400/60 shadow transition-all duration-150" />
    );
}

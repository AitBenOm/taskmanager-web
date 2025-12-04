"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FlowAddCardProps {
    onAdd: (title: string) => void;
}

export function FlowAddCard({ onAdd }: FlowAddCardProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    const submit = () => {
        if (title.trim().length === 0) return;
        onAdd(title);
        setTitle("");
        setOpen(false);
    };

    if (!open)
        return (
            <button
                onClick={() => setOpen(true)}
                className="
          mt-2 text-sm text-gray-700 bg-white/60
          py-2 px-3 rounded-lg border border-gray-300
          hover:bg-white hover:shadow transition-all
        "
            >
                + Add Card
            </button>
        );

    return (
        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border shadow-sm">
            <Input
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-2">
                <Button onClick={submit} className="h-8 px-3">
                    Add
                </Button>

                <Button
                    variant="ghost"
                    className="h-8 px-3"
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}

"use client";

import {useEffect, useState} from "react";
import {DndContext, DragOverlay, PointerSensor, useSensor, useSensors,} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy,} from "@dnd-kit/sortable";

import {Button} from "@/components/ui/button";
import {useTaskStore} from "@/store/task-store";
import {FlowColumn} from "@/app/dashboard/tasks/components/FlowColumn";
import DroppableColumn from "@/app/dashboard/tasks/components/DroppableColumn";
import DropIndicator from "@/app/dashboard/tasks/components/DropIndicator";
import SortableTaskCard from "@/app/dashboard/tasks/components/SortableTaskCard";
import DragOverlayPortal from "@/app/dashboard/tasks/components/DragOverlayPortal";
import DragOverlayCard from "@/app/dashboard/tasks/components/DragOverlayCard";
import TaskInsightPanel from "@/app/dashboard/tasks/components/TaskInsightPanel";
import {useAuthStore} from "@/store/auth.store";

export default function TasksPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [overItem, setOverItem] = useState(null);

    const fetchTasks = useTaskStore((s => s.fetchTasks));
    const user = useAuthStore((s) => s.user);
    const updateTask = useTaskStore((s) => s.updateTask);

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 4}})
    );
    const originalTasks = useTaskStore((s => s.tasks));
    const tasks = originalTasks.filter(t => {
        console.log("Filtering task:", t, "for user:", user);
        return t.createdById === user?.id || t?.assignedToId === (user?.id);
    });

    useEffect(() => void fetchTasks(), []);

    const openModal = (task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    const getColumnTasks = (status) =>
        tasks.filter((t) => t.status === status);

    function handleDragMove(event) {
        setOverItem(event.over);
    }

    function handleDragEnd(event) {
        setOverItem(null);

        const {active, over} = event;
        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const draggedTask = tasks.find((t) => t.id === activeId);
        if (!draggedTask) return;

        let newStatus = overId;

        // Dropping on a task → adopt that task's column
        const overTask = tasks.find((t) => t.id === overId);
        if (overTask) newStatus = overTask.status;

        // Only update if changed
        if (draggedTask.status !== newStatus) {
            updateTask(draggedTask.id, {status: newStatus});
        }

        setActiveTask(null);
    }

    const currentGroupId = "add8834b-022d-470c-b1b5-3b5928872787"; // TEMP for now

    const columnColors = {
        TODO: "bg-blue-50/60",
        IN_PROGRESS: "bg-yellow-50/60",
        DONE: "bg-green-50/60",
    };

    return (
        <main className="flex flex-col h-full space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tasks</h1>

                <Button
                    onClick={() => openModal(null)}
                    className="rounded-full px-5 h-10 bg-blue-600 text-white"
                >
                    + New Task
                </Button>
            </div>

            {/* BOARD */}
            <DndContext
                sensors={sensors}
                onDragStart={(event) => {
                    const task = tasks.find((t) => t.id === event.active.id);
                    setActiveTask(task);
                }}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveTask(null)}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)] overflow-hidden">

                    {["TODO", "IN_PROGRESS", "DONE"].map((col) => (
                        <div key={col} className="flex flex-col h-full overflow-hidden">

                            <FlowColumn
                                title={
                                    col === "TODO"
                                        ? "To Do"
                                        : col === "IN_PROGRESS"
                                            ? "In Progress"
                                            : "Done"
                                }
                                tasksCount={getColumnTasks(col).length}
                                status={col}
                            />

                            <SortableContext
                                id={col}
                                items={getColumnTasks(col).map((t) => t.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <DroppableColumn id={col} className={columnColors[col]}>
                                    <div className="flex flex-col gap-4 w-full">

                                        {getColumnTasks(col).map((task) => (
                                            <div key={task.id}>
                                                {/* Drop Indicator Above */}
                                                {overItem?.id === task.id &&
                                                    <DropIndicator
                                                        active={activeTask}
                                                        over={overItem}
                                                    />}

                                                <SortableTaskCard
                                                    task={task}
                                                    onClick={() => openModal(task)}
                                                />
                                            </div>
                                        ))}

                                        {/* Column empty → drop zone */}
                                        {getColumnTasks(col).length === 0 && (
                                            <div
                                                className="text-center text-gray-400 p-6 border border-dashed rounded-xl">
                                                Drop tasks here
                                            </div>
                                        )}
                                    </div>
                                </DroppableColumn>
                            </SortableContext>
                        </div>
                    ))}

                </div>

                {/* DRAG OVERLAY */}
                <DragOverlayPortal>
                    <DragOverlay>
                        {activeTask ? <DragOverlayCard task={activeTask}/> : null}
                    </DragOverlay>
                </DragOverlayPortal>
            </DndContext>

            <TaskInsightPanel
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                taskId={selectedTask?.id}
                groupId={currentGroupId}/>
        </main>
    );
}

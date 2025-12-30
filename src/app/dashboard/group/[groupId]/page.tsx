"use client";


import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useGroupStore} from "@/store/group.store";
import {useWorkspaceStore} from "@/store/workspace.store";

export default function GroupPage() {
    const params = useParams();
    const groupId = params.groupId;
    const router = useRouter();


    const getGroupById = useGroupStore((s) => s.fetchGroupById)
    const activeGroup = useGroupStore((s) => s.activeGroup)
    const activeWork = useWorkspaceStore((s) => s.activeWorkspace)
    const todoTasks = activeGroup.tasks?.filter((task) => task.status === "TODO");
    const inProgressTasks = activeGroup?.tasks.filter((task) => task.status === "IN_PROGRESS");
    const doneTasks = activeGroup?.tasks.filter((task) => task.status === "DONE");

    useEffect(
        () => {
            console.log("Active Work:", activeWork);
            console.log("Fetching group data for ID:", groupId);
            getGroupById(groupId);
            console.log("Active Group Data:", activeGroup);
        }, []
    )


    {
        return (
            <div className="p-6 max-w-5xl mx-auto">

                <div className="
      bg-white/5
      backdrop-blur-lg
      border border-white/10
      shadow-xl shadow-black/30
      rounded-2xl
      p-8
      transition-all
      hover:scale-[1.01]
      hover:shadow-2xl
    "
                >

                    <button onClick={() => router.push("/dashboard/workspace/" + activeWork?.id)}
                            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6">
                        <span className="text-xl">←</span>
                        <span>Back to Main Workspace</span>
                    </button>

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {activeGroup?.name || "Group Name"}
                        </h1>
                        <p className="text-slate-400 mb-4">
                            {activeGroup?.description || "Group Name"}
                        </p>

                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-700 shadow transition">
                                Invite Member
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-green-600/80 hover:bg-green-700 shadow transition">
                                New Task
                            </button>
                            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 shadow transition">
                                More...
                            </button>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-white mb-4">Members</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {activeGroup?.members && activeGroup?.members.map((member) => (
                                <div key={member.id}
                                     className="p-4 bg-white/5 rounded-xl border border-white/10 shadow">
                                    <p className="text-white font-medium">{member.user?.fullName || "Unknown User"}</p>
                                    <p className="text-slate-400 text-sm">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>

                        <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">TODO</h3>

                            <div className="space-y-2">
                                {todoTasks && todoTasks.map((task) => (
                                    <div key={task.id}
                                         className="p-4 bg-white/5 rounded-lg border border-white/10 shadow">
                                        <p>{task.title}</p>
                                    </div>))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">IN PROGRESS</h3>

                            <div className="space-y-2">
                                {inProgressTasks && inProgressTasks.map((task) => (
                                    <div key={task.id}
                                         className="p-4 bg-white/5 rounded-lg border border-white/10 shadow">
                                        <p>{task.title}</p>
                                    </div>))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">DONE</h3>

                            <div className="space-y-2">
                                {doneTasks && doneTasks.map((task) => (
                                    <div key={task.id}
                                         className="p-4 bg-white/5 rounded-lg border border-white/10 shadow">
                                        <p>{task.title}</p>
                                    </div>))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        );
    }
}
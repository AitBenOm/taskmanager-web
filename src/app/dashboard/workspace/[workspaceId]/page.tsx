"use client"


import {useParams} from "next/navigation";
import {useWorkspaceStore} from "@/store/workspace.store";
import {useEffect} from "react";

export default function WorkspacesPage() {

    const params = useParams();
    const workspaceId = params.workspaceId;
    const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
    const fetchById = useWorkspaceStore((s) => s.fetchWorkspaceById);


    useEffect(() => {
        void fetchById(workspaceId?.toString());
    }, []);
    console.log(workspaceId);

    return (
        <div className="min-h-screen bg-[url('/dashboard-bg.png')] bg-cover bg-center bg-fixed p-6 space-y-12">

            <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0c111b]/70 via-[#0a0f1a]/60 to-[#05080f]/50
      backdrop-blur-2xl border border-white/10
      shadow-[0_8px_40px_rgba(0,0,0,0.6)]
      space-y-6">

                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        Workspace Name
                    </h1>
                    <p className="text-white/70 mt-2 text-sm">
                        This workspace is dedicated to frontend, backend and product teams.
                    </p>
                </div>

                <div>
      <span className="px-4 py-1.5 rounded-full
        bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 text-sm">
        OWNER
      </span>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                    <button className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20
        text-white hover:bg-white/20 transition">
                        Edit Workspace
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20
        text-white hover:bg-white/20 transition">
                        Invite Members
                    </button>
                    <button className="px-5 py-2.5 rounded-xl
        bg-gradient-to-r from-blue-600 to-cyan-500 text-white
        shadow-lg hover:shadow-cyan-400/20 hover:scale-[1.02] transition">
                        + Create Group
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Groups</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="p-6 rounded-2xl
        bg-gradient-to-br from-blue-700/30 via-blue-700/20 to-blue-700/10
        backdrop-blur-xl border border-white/10
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        space-y-3 text-white hover:border-white/20 transition">

                        <h3 className="text-xl font-semibold">Frontend Team</h3>
                        <p className="text-white/70 text-sm">12 Tasks · 6 Members</p>

                        <button className="px-4 py-2 mt-2 w-full rounded-lg bg-white/10
          border border-white/20 text-white hover:bg-white/20 transition">
                            Open Group
                        </button>
                    </div>

                    <div className="p-6 rounded-2xl
        bg-gradient-to-br from-blue-700/30 via-blue-700/20 to-blue-700/10
        backdrop-blur-xl border border-white/10
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        space-y-3 text-white">

                        <h3 className="text-xl font-semibold">Backend Team</h3>
                        <p className="text-white/70 text-sm">8 Tasks · 4 Members</p>

                        <button className="px-4 py-2 w-full rounded-lg bg-white/10
          border border-white/20 text-white hover:bg-white/20 transition">
                            Open Group
                        </button>
                    </div>

                    <div className="p-6 rounded-2xl flex items-center justify-center
        bg-gradient-to-br from-blue-700/20 via-blue-500/20 to-cyan-500/20
        backdrop-blur-xl border border-white/10
        shadow-[0_6px_30px_rgba(0,0,0,0.3)]
        text-white hover:bg-blue-600/20 transition cursor-pointer">

        <span className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          + Add Group
        </span>
                    </div>

                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Members</h2>

                <div className="space-y-4">

                    <div className="flex items-center justify-between p-4 rounded-xl
        bg-white/5 backdrop-blur-xl border border-white/10
        text-white shadow">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
                            <div>
                                <p className="font-semibold">Omar B.</p>
                                <p className="text-white/60 text-xs">omar@example.com</p>
                            </div>
                        </div>

                        <span
                            className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-400/20">
          OWNER
        </span>

                        <div className="flex items-center gap-3">
                            <button className="text-white/60 hover:text-white text-sm">Change Role</button>
                            <button className="text-red-300/80 hover:text-red-300 text-sm">Remove</button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl
        bg-white/5 backdrop-blur-xl border border-white/10
        text-white shadow">

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20"></div>
                            <div>
                                <p className="font-semibold">Sarah M.</p>
                                <p className="text-white/60 text-xs">sarah@example.com</p>
                            </div>
                        </div>

                        <span
                            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs border border-blue-400/20">
          ADMIN
        </span>

                        <div className="flex items-center gap-3">
                            <button className="text-white/60 hover:text-white text-sm">Change Role</button>
                            <button className="text-red-300/80 hover:text-red-300 text-sm">Remove</button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Workspace Statistics</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div className="p-6 text-center rounded-2xl
        bg-gradient-to-br from-blue-600/30 to-blue-800/20
        backdrop-blur-xl border border-white/10 text-white shadow">
                        <p className="text-white/70 text-sm">Total Groups</p>
                        <p className="text-3xl font-bold mt-2">3</p>
                    </div>

                    <div className="p-6 text-center rounded-2xl
        bg-gradient-to-br from-blue-600/30 to-blue-800/20
        backdrop-blur-xl border border-white/10 text-white shadow">
                        <p className="text-white/70 text-sm">Total Members</p>
                        <p className="text-3xl font-bold mt-2">10</p>
                    </div>

                    <div className="p-6 text-center rounded-2xl
        bg-gradient-to-br from-blue-600/30 to-blue-800/20
        backdrop-blur-xl border border-white/10 text-white shadow">
                        <p className="text-white/70 text-sm">Total Tasks</p>
                        <p className="text-3xl font-bold mt-2">42</p>
                    </div>

                </div>
            </div>

            <div className="space-y-6 pb-20">
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>

                <div className="space-y-3">
                    <div
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow">
                        ✓ Omar created group “Frontend”
                    </div>
                    <div
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow">
                        ✓ Sarah joined the workspace
                    </div>
                    <div
                        className="p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow">
                        ✓ New task added to Backend team
                    </div>
                </div>
            </div>

        </div>

    );
}
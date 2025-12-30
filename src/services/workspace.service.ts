import {CreateWorkspaceDTO, Workspace, WorkspaceFullDTO} from "@/types/workspace";
import {safeGet, safePost} from "@/lib/api/helpers";

const BASE = "/workspaces";

export const WorkspaceService = {

    async createWorkspace(data: CreateWorkspaceDTO): Promise<Workspace | undefined> {
        const url = `${BASE}`;
        return safePost<Workspace>(url, data).then((res) => {
            return res?.data;
        });
    },

    async getWorkspaces() {
        const url = `${BASE}`;
        const res = await safeGet<WorkspaceFullDTO[]>(url);
        return res?.data;
    },
    async getWorkspaceById(id: string) {
        const url = `${BASE}/${id}`;
        const workspace = await safeGet<WorkspaceFullDTO>(url);
        return workspace?.data;

    }
}
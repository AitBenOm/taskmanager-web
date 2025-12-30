import {safeGet} from "@/lib/api/helpers";

const BASE = "/groups";

export const Groupservice = {


    async getGroupById(id: string) {
        const url = `${BASE}/${id}`;
        const group = await safeGet<any>(url);
        return group?.data;
    }
}
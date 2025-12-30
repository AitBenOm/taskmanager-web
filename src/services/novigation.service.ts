import {safeGet} from "@/lib/api/helpers";
import {SidebarRoleManagerInput} from "@/lib/navigation/SidebarRoleManager";

const BASE = "/navigation";

export const NavigationService = {
    async getNavigationContext(userId: string) {
        const url = `${BASE}/context/${userId}`;
        const res = await safeGet<SidebarRoleManagerInput>(url);
        console.log('NavigationService.getNavigationContext:', res);
        if (!res) {
            throw new Error('Failed to fetch navigation context');
        }
        return res.data;
    }
}
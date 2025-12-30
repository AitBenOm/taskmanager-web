"use client";

import {GroupDTO} from "@/types/workspace";
import {create} from "zustand";
import {immer} from "zustand/middleware/immer";
import {Groupservice} from "@/services/group.service";

interface GroupStore {
    groups: GroupDTO[];
    activeGroup?: GroupDTO;
    // createGroup: (gr: GroupDTO) => Promise<GroupDTO>;
    //  fetchGrouprsByUse: (userId: string) => Promise<GroupDTO[]>
    fetchGroupById: (id: string) => Promise<GroupDTO | undefined>;
}

export const useGroupStore = create<GroupStore>()(
    immer((set, get) => ({
        groups: [],

        fetchGroupById: async (groupId: string) => {
            const group = await Groupservice.getGroupById(groupId);
            set((state) => {
                state.activeGroup = group;
            });
        }
    }))
);


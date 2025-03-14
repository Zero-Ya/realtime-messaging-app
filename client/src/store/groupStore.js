import { create } from "zustand";
import { useChatStore } from "./chatStore";
import { useAuthStore } from "./authStore";

export const useGroupStore = create((set, get) => ({
    selectedGroup: null,
    groups: [],
    groupMessages: [],

    isUpdatingGroupImage: false,
    isGettingGroups: false,
    isGroupMessagesLoading: false,

    setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

    createGroup: async (groupName, members) => {
        const bodyData = { groupName, membersId: members }

        try {
            const res = await fetch("/api/groups/", { method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(bodyData) })
            const data = await res.json()
            console.log(data)
        } catch (error) {
            // 
        }
    },

    getAllGroups: async () => {
        set({ isGettingGroups: true });
        try {
            const res = await fetch("/api/groups/all");
            const data = await res.json()
            set({ groups: data })
        } catch (error) {
            // 
        } finally {
            set({ isGettingGroups: false });
        }
    },

    sendGroupMessage: async (messageData) => {
        const { selectedGroup } = get();
        try {
            const res = await fetch(`/api/messages/groups/${selectedGroup.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(messageData) })
            const data = await res.json();
            set({ groupMessages: [...get().groupMessages, data] });
            console.log(data)
            // Get all something
        } catch (error) {
            // 
        }
    },

    getGroupMessages: async () => {
        const { selectedGroup } = get();

        set({ isGroupMessagesLoading: true });
        try {
            const res = await fetch(`/api/messages/groups/${selectedGroup.id}`);
            const data = await res.json();
            set({ groupMessages: data });
        } catch (error) {
            // 
        } finally {
            set({ isGroupMessagesLoading: false });
        }
    },

    updateGroupImage: async (data) => {
        const { selectedGroup } = get();
        set({ isUpdatingGroupImage: true });
        try {
            const res = await fetch(`/api/groups/update-image/${selectedGroup?.id}`, { method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
            const groupData = await res.json();
            set({ selectedGroup: groupData })
        } catch (error) {
            // 
        } finally {
            set({ isUpdatingGroupImage: false });
        }
    },
}));
import { create } from "zustand";
import { useChatStore } from "./chatStore";
import { useAuthStore } from "./authStore";

export const useGroupStore = create((set, get) => ({
    selectedGroup: null,
    groups: [],
    groupMessages: [],

    isCreatingGroup: false,
    isUpdatingGroupImage: false,
    isGettingGroups: false,
    isGroupMessagesLoading: false,

    setSelectedGroup: (selectedGroup) => {
        const socket = useAuthStore.getState().socket;

        set({ selectedGroup });
        // Emit join room event
        socket.emit('join', selectedGroup.id);
    },

    createGroup: async (groupName, members, groupImg) => {
        const authUser = useAuthStore.getState().authUser
        const bodyData = { groupName, membersId: members.concat(authUser.id), groupImg }

        set({ isCreatingGroup: true });
        try {
            const res = await fetch("/api/groups/", { method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(bodyData) });
            const data = await res.json();
            get().getAllGroups();
            console.log(data)
        } catch (error) {
            // 
        } finally {
            set({ isCreatingGroup: false });
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
            const res = await fetch(`/api/messages/groups/${selectedGroup.id}`, { method: "POST", body: messageData })
            const data = await res.json();
            // set({ groupMessages: [...get().groupMessages, data] });
            get().getAllGroups();
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

    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();
        if (!selectedGroup) return

        const socket = useAuthStore.getState().socket;

        socket.on("send-channel-message", (message) => {
            if (message.groupId !== selectedGroup.id) return
            set({ groupMessages: [...get().groupMessages, message] })
        });

        // Refresh chat to top
        socket.on("refreshGroupChats", (msg) => {
            get().getAllGroups();
        });
    },

    unsubscribeFromGroupMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("send-channel-message");
    }

}));
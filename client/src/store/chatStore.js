import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    chats: [],
    chat: null,
    selectedChat: null,
    selectedUserChat: null,
    isChatsLoading: false,
    isMessagesLoading: false,

    showImage: false,
    imageUrl: null,

    setShowImage: (showImage) => set({ showImage }),

    setImageUrl: (imageUrl) => set({ imageUrl }),

    setSelectedChat: (selectedChat) => set({ selectedChat }),

    getUserChat: async (selectedUserId) => {
        try {
            const res = await fetch(`/api/chats/users/${selectedUserId}`);
            const data = await res.json();
            if (data.message) return;
            set({ selectedUserChat: data });
        } catch (error) {
            // 
        }
    },

    getAllChats: async () => {
        try {
            const res = await fetch("/api/chats/all");
            const data = await res.json();
            if (data.message) return;
            set({ chats: data });
        } catch (error) {
            console.log(error)
        }
    },

    getMessages: async (selectedChat) => {
        set({ isMessagesLoading: true });
        try {
            const res = await fetch(`/api/messages/chats/${selectedChat}`);
            const data = await res.json();
            if (data.message) return;
            set({ messages: data });
            get().getAllChats();
        } catch (error) {
            // 
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    getChat: async (selectedChat) => {
        const authUser = useAuthStore.getState().authUser;
        try {
            const res = await fetch(`/api/chats/chat/${authUser.id}/${selectedChat}`);
            const data = await res.json();
            if (data.message) return;
            set({ chat: data });
        } catch (error) {
            // 
        }
    },

    sendMessage: async (messageData) => {
        const { selectedChat, chat } = get();
        try {
            const res = await fetch(`/api/messages/chats/${chat.id}/${selectedChat}`, { method: "POST", body: messageData });
            const data = await res.json();
            if (data.message) return;
            // set({ messages: [...get().messages, data] });
            get().getAllChats();
        } catch (error) {
            // 
        }
    },

    removeChat: () => {
        set({ chat: null });
        set({ messages: [] });
        set({ selectedChat: null });
        set({ selectedUserChat: null });
        get().getAllChats();
    },

    subscribeToMessages: () => {
        const { selectedChat } = get();
        if (!selectedChat) return

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (message) => {
            set({ messages: [...get().messages, message] });
        });

        // Refresh chat to top
        socket.on("refreshChats", (message) => {
            get().getAllChats();
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    }

}))
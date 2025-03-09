import { create } from "zustand";
import { useAuthStore } from "./authStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    chats: [],
    chat: null,
    selectedChat: null,
    isChatsLoading: false,
    isMessagesLoading: false,

    setSelectedChat: (selectedChat) => set({ selectedChat }),

    getAllChats: async () => {
        try {
            const res = await fetch("/api/chats/all");
            const data = await res.json();
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
            set({ chat: data });

        } catch (error) {
            // 
        }
    },

    sendMessage: async (messageData) => {
        const { selectedChat, chat } = get();
        try {
            const res = await fetch(`/api/messages/${chat.id}/${selectedChat}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(messageData) });
            const data = await res.json();
            // set({ messages: [...messages, data] })
            get().getMessages(selectedChat);
        } catch (error) {
            // 
        }
    },

    subscribeToMessages: () => {
        const { selectedChat } = get();
        if (!selectedChat) return

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (message) => {
            if (message.senderId !== selectedChat) return
            set({ messages: [...get().messages, message] })
        });

        // Refresh chat to top
        socket.on("refreshChats", (msg) => {
            get().getAllChats()
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    }

}))
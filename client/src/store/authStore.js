import { create } from "zustand";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    allUsers: [],

    isCheckingAuth: false,
    isGettingAllUsers: false,
    isUpdatingProfile: false,
    isLoggingOut: false,

    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await fetch("/api/authUser");
            const data = await res.json();
            if (data.message) return;
            set({ authUser: data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    getAllUsers: async () => {
        set({ isGettingAllUsers: true });
        try {
            const res = await fetch("/api/all-users");
            const data = await res.json();
            if (data.message) return;
            set({ allUsers: data });
        } catch (error) {
            // 
        } finally {
            set({ isGettingAllUsers: false });
        }
    },

    login: async (data) => {
        try {
            if (data.message) return;
            set({ authUser: data });
            get().connectSocket();
        } catch (error) {
            // Toast
        }
    },

    logout: async() => {

        set({ isLoggingOut: true });
        try {
            await fetch("/api/logout");
            set({ authUser: null });
            get().disconnectSocket();

        } catch (error) {
            //  Toast
        } finally {
            set({ isLoggingOut: false });
            window.location.reload();
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await fetch("/api/update-profile", { method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
            const authUserData = await res.json();
            if (data.message) return;
            set({ authUser: authUserData });
        } catch (error) {
            // Toast
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io("http://localhost:3000", {
            query: {
                userId: authUser.id
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null })
        }
    }

}));
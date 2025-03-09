// Modules
import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

// Components
import ChatList from "../components/ChatList";
import ChatPlace from "../components/ChatPlace";
import Profile from "../components/Profile";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

function HomePage() {
    const { authUser } = useAuthStore();
    const { getAllChats } = useChatStore();

    const [navSelection] = useOutletContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (!authUser) navigate("/login")
    }, [authUser])

    useEffect(() => {
        if (!authUser) return
        getAllChats()
    }, [authUser])

    if (navSelection === "profile") return (
        <Profile />
    )

    return (
        authUser &&
        <div className="w-full flex gap-2">
            <ChatList />
            <ChatPlace />
        </div>
    )
}

export default HomePage
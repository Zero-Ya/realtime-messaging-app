// Modules
import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

// Components
import ChatList from "../components/Chats/ChatList";
import ChatPlace from "../components/Chats/ChatPlace";
import GroupPage from "../components/Groups/GroupPage";
import PeoplePage from "../components/PeoplePage";
import ProfilePage from "../components/ProfilePage";

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

    if (navSelection === "group") return (
        <GroupPage />
    )

    if (navSelection === "people") return (
        <PeoplePage />
    )

    if (navSelection === "profile") return (
        <ProfilePage />
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
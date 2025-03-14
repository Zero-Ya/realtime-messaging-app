// Modules
import { useState, useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

function Chat({ userId }) {
    const { onlineUsers } = useAuthStore();
    const { setSelectedChat, getUserChat , messages } = useChatStore();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function chatOnClick(userId) {
        setSelectedChat(userId)
        getUserChat(userId)
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/chats/users/${userId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setIsLoading(false);
        })
        .catch(err => console.log(err))
    }, [])

    if (isLoading) return (
        <div className="px-4 py-3">
            <div className="flex items-center gap-3">
                <img className="size-8 rounded-full object-cover border-2" src={avatar} />
                <div className="text-xl">Loading...</div>
            </div>    
        </div>
    )

    return (
        <div className={`px-4 py-3 hover:bg-slate-800 ${(userId === messages[0]?.receiverId || userId === messages[0]?.senderId) && 'bg-slate-800'}`} onClick={() => chatOnClick(userId)}>
            {(user) && 
            <div className="flex items-center gap-3">
                <img className="size-8 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                <div className="text-xl">{user.username}</div>
                <div className={`${(onlineUsers.includes(userId.toString())) ? 'bg-green-600' : 'bg-red-600'} rounded-full p-1`}></div>
            </div>}
        </div>
    )
}

export default Chat
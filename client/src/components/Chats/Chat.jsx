// Modules
import { useState, useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

function Chat({ userId, setShowChat }) {
    const { onlineUsers } = useAuthStore();
    const { selectedChat, setSelectedChat, getUserChat, messages } = useChatStore();

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [latestMessage, setLatestMessage] = useState(null);

    function chatOnClick(userId) {
        setSelectedChat(userId)
        getUserChat(userId)
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(`https://realtime-messaging-app-9hpl.onrender.com/api/chats/users/${userId}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setUser(data);
            setIsLoading(false);
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetch(`https://realtime-messaging-app-9hpl.onrender.com/api/messages/chats/${userId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return
            setLatestMessage(data[data.length - 1])
        })
        .catch(err => console.log(err))
    }, [messages])

    if (isLoading) return (
        <div className="px-4 py-3">
            <div className="flex items-center gap-3">
                <img className="size-8 rounded-full object-cover border-2" src={avatar} />
                <div className="text-lg lg:text-xl">Loading...</div>
            </div>    
        </div>
    )

    return (
        <div className={`px-4 py-3 hover:bg-slate-800 ${(userId === selectedChat) && 'md:bg-slate-800'}`}
            onClick={() => {
                setShowChat(true)
                chatOnClick(userId)}
            }>
            
            {(user) && 
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <img className="size-10 md:size-8 lg:size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                    <div className="flex flex-col gap-1 w-40 sm:w-96 md:w-12 lg:w-28 xl:w-36">
                        <div className="text-lg lg:text-xl">{user.username}</div>
                        {latestMessage === null ? <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">No messages</div>
                        :
                        latestMessage?.senderId === userId ?
                        (latestMessage.text === "" && latestMessage.file) ?
                        <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">{user.username} sent an image</div> :
                        <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">{user.username}: {latestMessage?.text}</div>
                        :
                        (latestMessage.text === "" && latestMessage.file) ?
                        <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">You sent an image</div> :
                        <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">You: {latestMessage?.text}</div>}
                    </div>
                </div>
                <div className={`${(onlineUsers.includes(userId.toString())) ? 'bg-green-600' : 'bg-red-600'} rounded-full p-1`}></div>
            </div>}
        </div>
    )
}

export default Chat
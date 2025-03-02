// Modules
import { useState, useEffect } from "react";

// Icons
import { FaCircleUser } from "react-icons/fa6";

function Chat({ userId, setSelectedChat, onlineUsers }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch(`/api/chats/users/${userId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setUser(data)
        })
        .catch(err => console.log(err)) 
    }, [])

    return (
        <>
        <div className="flex items-center gap-2 hover:bg-slate-800" onClick={() => setSelectedChat(userId)}>
            {(user) && 
            <>
            <FaCircleUser size={30} />
            <div className="text-xl">{user.username}</div>
            {(onlineUsers.includes(userId.toString())) ? <div>Online</div> : <div>Offline</div>}
            </>}
        </div>
        </>
    )
}

export default Chat
// Modules
import { useState, useEffect } from "react"

// Store
import { useAuthStore } from "../../store/authStore";
import { useGroupStore } from "../../store/groupStore";

function GroupLatestMessage({ groupId }) {
    const { authUser } = useAuthStore();
    const { groups } = useGroupStore();

    const [latestMessage, setLatestMessage] = useState(null);
    const [sender, setSender] = useState(null)

    useEffect(() => {
        fetch(`https://realtime-messaging-app-9hpl.onrender.com/api/messages/groups/${groupId}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) return
            setLatestMessage(data[data.length - 1])
        })
        .catch(err => console.log(err))
    }, [groups])

    useEffect(() => {
        if (!latestMessage) return;
        fetch(`https://realtime-messaging-app-9hpl.onrender.com/api/chats/users/${latestMessage.senderId}`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => setSender(data))
    }, [latestMessage])

    return (
        <>
            {latestMessage === null ? <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">No messages</div>
            :
            latestMessage?.senderId === authUser.id ?
            (latestMessage.text === "" && latestMessage.file) ?
            <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">You sent an image</div> :
            <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">You: {latestMessage?.text}</div>
            :
            (latestMessage.text === "" && latestMessage.file) ?
            <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">{sender?.username} sent an image</div> :
            <div className="text-slate-300 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis">{sender?.username}: {latestMessage?.text}</div>}
        </>
    )
}

export default GroupLatestMessage
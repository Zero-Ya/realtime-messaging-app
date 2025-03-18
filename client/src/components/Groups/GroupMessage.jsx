// Modules
import { useState, useEffect } from "react";
import { format, formatDistance } from "date-fns";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useGroupStore } from "../../store/groupStore";

// Assets
import avatar from "../../assets/avatar.svg";

function GroupMessage({ message, messageEndRef }) {
    const { authUser } = useAuthStore();
    const { setShowImage, setImageUrl } = useChatStore();

    const [sender, setSender] = useState(null)

    useEffect(() => {
        fetch(`/api/chats/users/${message.senderId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => setSender(data))
    }, [])

    return (
        <>
        {(authUser.id === message.senderId) ?
        <div className="self-end" ref={messageEndRef}>
            {message.file && <img className="size-96 object-cover rounded-t-lg border-2 border-sky-600" src={message.file}
            onClick={() => {
                setShowImage(true)
                setImageUrl(message.file)
            }} />}
            <div className={`bg-sky-600 p-2 ${message.file ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
            <div className="text-slate-200 text-sm text-right my-1">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>
        :
        <div className="flex flex-col" ref={messageEndRef}>
            <div className="flex items-center gap-2">
                <img className={`size-8 rounded-full object-cover border-2 bg-slate-800 ${message.file && 'self-end'}`}
                src={sender?.profileImg || avatar} />
                <div>
                    {message.file && <img className="size-96 object-cover rounded-t-lg border-2 border-slate-600" src={message.file}
                    onClick={() => {
                        setShowImage(true)
                        setImageUrl(message.file)
                    }} />}
                    <div className={`bg-slate-600 p-2 self-start ${message.file ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
                </div>
            </div>
            <div className="text-slate-200 text-sm text-left my-1 ml-10">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>}
        </>
    )
}

export default GroupMessage
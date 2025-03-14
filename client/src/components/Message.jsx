// Modules
import { format, formatDistance } from "date-fns";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

// Assets
import avatar from "../assets/avatar.svg";

function Message({ message, senderId, messageEndRef }) {
    const { authUser } = useAuthStore();
    const { selectedChat, getUserChat, selectedUserChat } = useChatStore();

    return (
        <>
        {(senderId === authUser.id) ?
        <div className="self-end" ref={messageEndRef}>
            {message.image && <img className="size-96 object-cover rounded-t-lg border-2 border-sky-600" src={message.image} />}
            <div className={`bg-sky-600 p-2 ${message.image ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
            <div className="text-slate-200 text-sm text-right my-1">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>
        :
        <div className="flex flex-col" ref={messageEndRef}>
            <div className="flex items-center gap-2">
                <img className={`size-8 rounded-full object-cover border-2 bg-slate-800 ${message.image && 'self-end'}`}
                src={(selectedUserChat?.id === message?.receiverId || selectedUserChat?.id === message?.senderId) ? selectedUserChat?.profileImg || avatar : avatar} />
                <div>
                    {message.image && <img className="size-96 object-cover rounded-t-lg border-2 border-slate-600" src={message.image} />}
                    <div className={`bg-slate-600 p-2 self-start ${message.image ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
                </div>
            </div>
            <div className="text-slate-200 text-sm text-left my-1 ml-10">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>}       
        </>
    )
}

export default Message
// Modules
import { format, formatDistance } from "date-fns";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

// Assets
import avatar from "../assets/avatar.svg";

function Message({ message, senderId, messageEndRef }) {
    const { authUser } = useAuthStore();
    const { selectedUserChat, setShowImage, setImageUrl } = useChatStore();

    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath)
    }

    return (
        <>
        {(senderId === authUser.id) ?
        <div className="self-end" ref={messageEndRef}>
            {(message.file && checkIfImage(message.file)) && <img className="size-36 sm:size-56 md:size-72 lg:size-96 object-cover rounded-t-lg border-2 border-sky-600" src={message.file}
            onClick={() => {
                setShowImage(true)
                setImageUrl(message.file)
            }} />}
            <div className={`text-sm md:text-base bg-sky-600 p-2 max-w-36 sm:max-w-56 md:max-w-72 lg:max-w-96 max-h-96 overflow-y-auto break-words ${message.file ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
            <div className="text-slate-200 text-xs md:text-sm text-right my-1">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>
        :
        <div className="flex flex-col" ref={messageEndRef}>
            <div className="flex items-center gap-2">
                <img className={`size-6 sm:size-8 rounded-full object-cover border-2 bg-slate-800 self-end`}
                src={(selectedUserChat?.id === message?.receiverId || selectedUserChat?.id === message?.senderId) ? selectedUserChat?.profileImg || avatar : avatar} />
                <div>
                    {(message.file && checkIfImage(message.file)) && <img className="size-36 sm:size-56 md:size-72 lg:size-96 object-cover rounded-t-lg border-2 border-slate-600" src={message.file}
                    onClick={() => {
                        setShowImage(true)
                        setImageUrl(message.file)
                    }} />}
                    <div className={`text-sm md:text-base bg-slate-600 p-2 max-w-36 sm:max-w-56 md:max-w-72 lg:max-w-96 max-h-96 overflow-y-auto break-words self-start ${message.file ? 'rounded-b-lg' : 'rounded-lg'}`}>{message.text}</div>
                </div>
            </div>
            <div className="text-slate-200 text-xs md:text-sm text-left my-1 ml-10">{formatDistance(new Date(), message.createdAt) + ' ago at ' + format(message.createdAt, "h:mm a")}</div>
        </div>}       
        </>
    )
}

export default Message
// Icons
import { FaCircleUser } from "react-icons/fa6";

// Store
import { useAuthStore } from "../store/authStore";

function Message({ message, senderId, messageEndRef }) {
    const { authUser } = useAuthStore();

    return (
        <>
        {(senderId === authUser.id) ?
        <div className="bg-sky-600 p-2 self-end rounded-lg">{message.text}</div>
        :
        <div className="flex items-center gap-2" ref={messageEndRef}>
            <FaCircleUser size={25} />
            <div className="bg-slate-600 p-2 self-start rounded-lg">{message.text}</div>
        </div>
        }       
        </>
    )
}

export default Message
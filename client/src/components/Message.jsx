// Icons
import { FaCircleUser } from "react-icons/fa6";

function Message({ text, authUser, senderId }) {

    return (
        <>
        {(senderId === authUser.id) ?
        <div className="bg-slate-600 p-2 self-end rounded-lg">{text}</div>
        :
        <div className="flex items-center gap-2">
            <FaCircleUser size={25} />
            <div className="bg-slate-600 p-2 self-start rounded-lg">{text}</div>
        </div>
        }       
        </>
    )
}

export default Message
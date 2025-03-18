// Modules
import { useState } from "react";

// Assets
import avatar from "../assets/avatar.svg";

// Store
import { useChatStore } from "../store/chatStore";

function ProfileFriend({ user }) {
    const { removeChat } = useChatStore()

    const [isRemovingChat, setIsRemovingChat] = useState(false);

    function handleRemoveChat(userId) {
        setIsRemovingChat(true);
        
        fetch(`/api/chats/remove`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            removeChat()
            setIsRemovingChat(true)
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="flex justify-between items-center p-4 mx-4 bg-slate-900 rounded-lg">
            <div className="w-full flex justify-between">
                <div className="flex items-center gap-3">
                    <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                    <div className="text-2xl">{user.username}</div>
                </div>

                <div className="text-2xl text-red-600 cursor-pointer" onClick={() => handleRemoveChat(user.id)}>{isRemovingChat ? 'Removing...' : 'Unfriend'}</div>
            </div>
        </div>
    )
}

export default ProfileFriend
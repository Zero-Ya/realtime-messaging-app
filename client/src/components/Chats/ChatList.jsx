// Modules
import { useState } from "react";

// Icons
import { FaRegMessage } from "react-icons/fa6";

// Components
import Chat from "./Chat";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

function ChatList() {
    const { authUser } = useAuthStore();
    const { chats } = useChatStore();

    const allChatUsers = chats?.map((arr) => arr.members.filter((userId) => userId !== authUser?.id));

    return (
        <>
            <div className="w-80 flex flex-col gap-3 my-2 py-2 bg-slate-900 text-white rounded-lg">
                <div className="flex items-center gap-2 px-4">
                    <FaRegMessage className="size-10"/>
                    <div className="text-2xl font-semibold">Contacts</div>
                </div>

                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col">
                    {allChatUsers?.map((chat) => <Chat key={chat[0]} userId={chat[0]} />)}
                </div>
            </div>
        </>
    )
}

export default ChatList
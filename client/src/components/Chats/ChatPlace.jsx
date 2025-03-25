// Modules
import { useState, useEffect, useRef } from "react";

// Components
import Message from "../Message";
import MessageForm from "../MessageForm";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

// Assets
import { FaArrowLeft } from "react-icons/fa6";
import avatar from "../../assets/avatar.svg";
import cool_background from "../../assets/cool-background.png";

function ChatPlace({ showChatState }) {
    const [showChat, setShowChat] = showChatState;

    const { authUser } = useAuthStore();
    const { selectedChat, selectedUserChat, messages, isMessagesLoading, getMessages, getChat, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    useEffect(() => {
        if (!selectedChat) return;
        getMessages(selectedChat);
        getChat(selectedChat);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedChat])

    

    return (
        <div className={`${!showChat ? 'hidden' : 'flex'} w-full md:flex flex-col gap-4 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg`}>
            {(selectedUserChat?.id && !isMessagesLoading) &&
            <div className="flex items-center gap-3">
                <FaArrowLeft className="block md:hidden size-5" onClick={() => setShowChat(false)} />
                <img className="size-8 rounded-full object-cover border-2 bg-slate-800" src={selectedUserChat?.profileImg || avatar} />
                <div className="text-2xl">{selectedUserChat?.username}</div>
            </div>}

            {(selectedChat !== null) && <>

            <div className="h-full flex flex-col justify-between gap-4">
                <div className={`relative h-[calc(100dvh-9rem)]`}>
                    {!isMessagesLoading && <img className="absolute w-full h-full object-cover opacity-50 inset-0 rounded-lg" src={cool_background} />}

                    <div className={`h-full overflow-y-auto p-4 relative flex flex-col gap-6 ${isMessagesLoading || messages.length === 0 ? `justify-center` : `justify-normal`}`}>
                        {(isMessagesLoading) ? <div className="self-center text-xl">Loading...</div> :
                        messages.length === 0 ? <div className="bg-slate-800 p-4 rounded-lg text-center self-center text-xl">Say hi to the conversation!</div> :
                        messages.map((message) => (
                            <Message key={message.id} message={message} senderId={message.senderId} messageEndRef={messageEndRef} />
                        ))}
                    </div>
                </div>

                <MessageForm selectedType={"chat"} />
            </div>

            </>}
        </div>
    )
}

export default ChatPlace
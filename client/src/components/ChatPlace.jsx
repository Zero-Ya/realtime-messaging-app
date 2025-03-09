// Modules
import { useEffect, useRef } from "react";

// Components
import Message from "./Message";
import MessageForm from "./MessageForm";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

// Assets
import cool_background from "../assets/cool-background.png"

function ChatPlace() {
    const { authUser } = useAuthStore();
    const { selectedChat, messages, isMessagesLoading, getMessages, getChat, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])



    useEffect(() => {
        if (selectedChat) {
            getMessages(selectedChat)
            getChat(selectedChat)
            subscribeToMessages()
        }
        return () => unsubscribeFromMessages()
    }, [selectedChat])

    return (
        <div className="w-full flex flex-col gap-4 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
            <div>ChatPlace</div>

            {(selectedChat !== null) && <>

            <div className="h-full flex flex-col justify-between gap-4">
                <div className={`relative h-[calc(100vh-8rem)]`}>
                    <img className="absolute w-full h-full object-cover opacity-50 inset-0 rounded-lg" src={cool_background} />

                    <div className={`h-full overflow-y-auto p-4 relative flex flex-col gap-2 ${isMessagesLoading ? `justify-center` : `justify-normal`}`}>
                        {(isMessagesLoading) ? <div className="self-center">...</div> :
                        messages.map((message) => (
                            <Message key={message.id} message={message} senderId={message.senderId} messageEndRef={messageEndRef} />
                        ))}
                    </div>
                </div>

                <MessageForm />
            </div>

            </>}
        </div>
    )
}

export default ChatPlace
// Modules
import { useState, useEffect } from "react";

// Components
import Message from "./Message";

function ChatPlace({ selectedChat, authUser, socket }) {
    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState("");

    function subscribeToMessages() {
        if (!selectedChat) return

        socket.on("newMessage", (message) => {
            setMessages(m => [...m, message])
        });
    }

    function unsubscribeFromMessages() {
        socket.off("newMessage");
    }

    function fetchMessages() {
        // needs to change refer to line 52
        if (selectedChat === null) return
        fetch(`/api/messages/chats/${selectedChat}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.log(err))
    }

    function fetchChat() {
        fetch(`/api/chats/chat/${authUser.id}/${selectedChat}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => setChat(data))
        .catch(err => console.log(err))
    }

    function handleSubmit(e) {
        e.preventDefault();

        fetch(`/api/messages/${chat.id}/${selectedChat}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            fetchMessages()
            setMessage("")
        })
        .catch(err => console.log(err))
    }



    // use only the function on click rather than useeffect
    useEffect(() => {
        if (selectedChat) {
            fetchMessages()
            fetchChat()
            subscribeToMessages()
        }
        return () => unsubscribeFromMessages()
    }, [selectedChat])

    return (
        <>
            <div className="w-full flex flex-col justify-between gap-2 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
                <div>ChatPlace</div>

                {(messages.length !== 0) && <>

                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto flex flex-col gap-2 p-4 bg-slate-800 rounded-lg">
                    {messages.map((message) => (
                        <Message key={message.id} text={message.text} authUser={authUser} senderId={message.senderId}/>
                    ))}
                </div>

                <form className="flex items-center gap-2">
                    <label htmlFor="message">Message: </label>
                    <input className="p-1 text-black rounded-lg" type="text" id="message" name="message" value={message}
                    placeholder="Message..." onChange={(e) => setMessage(e.target.value)} />
                    <button type="submit" onClick={handleSubmit}>Send Message</button>
                </form>

                </>}
            </div>
        </>
    )
}

export default ChatPlace
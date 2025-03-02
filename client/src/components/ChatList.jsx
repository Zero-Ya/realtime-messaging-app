// Modules
import { useState } from "react";

// Icons
import { FaUserGroup } from "react-icons/fa6";

// Components
import Chat from "./Chat";

function ChatList({ authUser, allChats, setSelectedChat, onlineUsers }) {

    const [username, setUsername] = useState("");

    const allChatUsers = allChats.map((arr) => arr.members.filter((userId) => userId !== authUser.id));

    function handleSubmit(e) {
        e.preventDefault()

        fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }

    return (
        <>
            <div className="w-80 flex flex-col gap-2 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
                <div className="flex items-center gap-2">
                    <FaUserGroup size={35}/>
                    <div className="text-2xl">Contacts</div>
                </div>

                <br />

                {/* <form className="flex gap-2">
                    <label htmlFor="username">Add User: </label>
                    <input type="text" id="username" name="username" value={username}
                    placeholder="John Doe" onChange={(e) => setUsername(e.target.value)} required />

                    <button type="submit" onClick={handleSubmit}>Add Chat</button>
                </form> */}

                <div>
                    {allChatUsers.map((chat) => <Chat key={chat[0]} userId={chat[0]} setSelectedChat={setSelectedChat} onlineUsers={onlineUsers} />)}
                </div>
            </div>
        </>
    )
}

export default ChatList
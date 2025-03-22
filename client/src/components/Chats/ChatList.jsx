// Modules
import { useEffect, useState } from "react";

// Icons
import { FaRegMessage, FaMagnifyingGlass } from "react-icons/fa6";

// Components
import Chat from "./Chat";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";

function ChatList({ showChatState }) {
    const [showChat, setShowChat] = showChatState;

    const { authUser, allUsers } = useAuthStore();
    const { chats } = useChatStore();

    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const allChatUsers = [].concat(...chats?.map((arr) => arr.members.filter((userId) => userId !== authUser?.id)));

    const allFriends = allUsers?.filter((user) => allChatUsers.includes(user.id));

    useEffect(() => {
        setFilteredUsers(allFriends.map((user) => user.id));
    }, [allUsers])

    useEffect(() => {
        if (query === "") return setFilteredUsers(allFriends.map((user) => user.id));

        setFilteredUsers(
            allFriends.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))
        .map((user) => user.id)
        )
    }, [query])

    return (
        <>
            <div className={`${showChat ? 'hidden' : 'flex'} w-full md:w-48 lg:w-80 md:flex flex-col gap-3 my-2 py-2 bg-slate-900 text-white rounded-lg`}>
                <div className="flex items-center gap-2 px-4 py-2 md:py-0">
                    <FaRegMessage className="size-6 lg:size-10"/>
                    <div className="text-xl lg:text-2xl font-semibold">Contacts</div>
                </div>

                <div className="max-w-full md:max-w-64 flex items-center gap-2 px-4 md:px-2 lg:px-4 mx-3 md:mx-2 lg:mx-3 mt-2 bg-slate-800 rounded-lg border-2 border-slate-600">
                    <label htmlFor="search-bar"><FaMagnifyingGlass className="size-5 md:size-4 lg:size-5 cursor-pointer" /></label>
                    <input className="w-full text-lg md:text-base lg:text-lg text-white p-2 md:p-1 bg-slate-800" type="search" placeholder="Search Contact" id="search-bar"
                    onChange={(e) => setQuery(e.target.value)} value={query} />
                </div>

                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col">
                    {filteredUsers?.map((chat) => <Chat key={chat} userId={chat} setShowChat={setShowChat} />)}
                </div>
            </div>
        </>
    )
}

export default ChatList
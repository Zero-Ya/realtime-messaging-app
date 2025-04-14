// Modules
import { useState, useEffect } from "react";

// Assets
import { FaUsers, FaMagnifyingGlass } from "react-icons/fa6";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

// Components
import PeopleFriend from "./PeopleFriend";

function PeoplePage() {
    const { authUser } = useAuthStore();
    const { chats } = useChatStore();
    const allFriends = chats?.map((arr) => arr.members);
    const allFriendsFlat = (chats.length !== 0) ? [].concat(...allFriends) : [].concat(...allFriends).concat(authUser?.id)

    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([])
    const [query, setQuery] = useState("");

    const allUsersExcFriends = allUsers.filter((user) => !allFriendsFlat.includes(user.id))

    useEffect(() => {
        fetch("https://realtime-messaging-app-9hpl.onrender.com/api/all-users", {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            setAllUsers(data)
            setFilteredUsers(data.filter((user) => !allFriendsFlat.includes(user.id)))
        })
        .catch(err => console.log(err))
    }, [chats])

    useEffect(() => {
        setFilteredUsers(allUsersExcFriends.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
    }, [query])

    return (
        authUser &&
        <div className="w-full flex flex-col gap-6 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
            <div className="flex items-center gap-2 py-2 md:py-0">
                <FaUsers className="size-6 lg:size-10" />
                <div className="text-xl lg:text-2xl font-semibold">Find Friends</div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <FaMagnifyingGlass className="size-5 lg:size-6" />
                <input className="text-base lg:text-lg p-1 md:p-2 bg-slate-800 rounded-lg border-4 border-slate-600" type="search" placeholder="Search for user..."
                value={query} onChange={(e) => setQuery(e.target.value)}/>
            </label>

            <div className="flex flex-col h-[calc(100dvh-12rem)] overflow-y-auto gap-6 py-4 bg-slate-950 rounded-lg">
            {filteredUsers.map((user) => (
                <PeopleFriend key={user.id} user={user} />
            ))}
            </div>

        </div>
    )
}

export default PeoplePage
// Modules
import { useState, useEffect } from "react";

// Assets
import { FaUsers, FaMagnifyingGlass, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import avatar from "../assets/avatar.svg";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

function PeoplePage() {
    const { authUser } = useAuthStore();
    const { chats, getAllChats } = useChatStore();
    const allFriends = chats?.map((arr) => arr.members);
    const allFriendsFlat = (chats.length !== 0) ? [].concat(...allFriends) : [].concat(...allFriends).concat(authUser?.id)

    const [isFetching, setIsFetching] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([])
    const [query, setQuery] = useState("");

    const allUsersExcFriends = allUsers.filter((user) => !allFriendsFlat.includes(user.id))

    function addFriend(e, username) {
        e.preventDefault()

        setIsFetching(true)
        fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setIsFetching(false);
            console.log(data)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        fetch("/api/all-users", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setAllUsers(data)
            setFilteredUsers(data.filter((user) => !allFriendsFlat.includes(user.id)))
        })
        .catch(err => console.log(err))
    }, [chats])

    useEffect(() => {
        if (!isFetching) getAllChats()
    }, [isFetching])

    useEffect(() => {
        setFilteredUsers(allUsersExcFriends.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
    }, [query])

    return (
        authUser &&
        <div className="w-full flex flex-col gap-6 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
            <div className="flex items-center gap-3">
                <FaUsers className="size-10" />
                <div className="text-2xl font-semibold">Find Friends</div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <FaMagnifyingGlass className="size-6" />
                <input className="text-lg p-2 bg-slate-800 rounded-lg border-4 border-slate-600" type="search" placeholder="Search for user..."
                value={query} onChange={(e) => setQuery(e.target.value)}/>
            </label>

            <div className="flex flex-col h-[calc(100vh-12rem)] overflow-y-auto gap-6 py-4 bg-slate-950 rounded-lg">
            {filteredUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-4 mx-4 bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                        <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                        <div className="text-2xl">{user.username}</div>
                    </div>

                    <div className="flex items-start gap-3 cursor-pointer" onClick={(e) => addFriend(e, user.username)}>
                        <FaUserCheck className="size-6" />
                        <div className="text-lg">{isFetching ? 'Adding...' : 'Add Friend' }</div>
                    </div>
                </div>
            ))}
            </div>

        </div>
    )
}

export default PeoplePage
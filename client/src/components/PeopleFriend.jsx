// Modules
import { useState, useEffect } from "react";

// Store
import { useChatStore } from "../store/chatStore";

// Assets
import { FaUserCheck } from "react-icons/fa6";
import avatar from "../assets/avatar.svg";

function PeopleFriend({ user }) {
    const { getAllChats } = useChatStore();

    const [isFetching, setIsFetching] = useState(false);

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
        if (!isFetching) getAllChats()
    }, [isFetching])

    return (
        <div className="flex justify-between items-center p-4 mx-4 bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
                <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                <div className="text-2xl">{user.username}</div>
            </div>

            <div className="flex items-start gap-3 cursor-pointer" onClick={(e) => addFriend(e, user.username)}>
                <FaUserCheck className="size-6" />
                <div className="text-lg">{isFetching ? 'Adding...' : 'Add Friend' }</div>
            </div>
        </div>
    )
}

export default PeopleFriend
// Modules
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

// Components
import Navbar from "../components/Navbar";
import ChatList from "../components/ChatList";
import ChatPlace from "../components/ChatPlace";

function HomePage() {
    const [authUser, setAuthUser] = useState(null)
    const [allChats, setAllChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const [loading, setLoading] = useState(true)

    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)
    
    function connectSocket(data) {
        const socket = io("http://localhost:3000", {
            query: {
                userId: data.authUser.id
            }
        });
        socket.connect()
        setSocket(socket)

        socket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }

    function getAuthUser() {
        fetch("/api/authUser", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            if (data.authUser) {
                setAuthUser(data.authUser)
                connectSocket(data)
            }
            else console.log(data.msg)
            setLoading(false)
        })
        .catch(err => console.log(err))
    }

    function getAllChats() {
        fetch("/api/chats/all", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setAllChats(data)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        getAuthUser()
        getAllChats()
    }, [])



    function debug() {
        console.log(onlineUsers)
    }

    return (
        <>

        {loading ? <div>Loading...</div> :
        <>  
            <button onClick={debug}>Click me!</button>

            {!authUser ? 
            <div className="flex flex-col gap-2 p-4">
                <div>You're not allowed here!</div>
                <Link className="text-blue-600 hover:text-blue-800" to="/login">Login</Link>
                <Link className="text-blue-600 hover:text-blue-800" to="/register">Register</Link>
            </div> :
            <div className="flex gap-2 px-2 justify-between bg-slate-950">
                <Navbar socket={socket} />

                <ChatList authUser={authUser} allChats={allChats} setSelectedChat={setSelectedChat} onlineUsers={onlineUsers} />

                <ChatPlace selectedChat={selectedChat} authUser={authUser} socket={socket} />

            </div>}
        </>}

        </>
    )
}

export default HomePage
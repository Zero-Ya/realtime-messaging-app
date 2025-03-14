// Modules
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Store
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";

function App() {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
    const { messages, chats } = useChatStore();

    const [navSelection, setNavSelection] = useState("chat");

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        navigate("/");
    }, [])

    useEffect(() => {
        if (authUser) navigate("/");
    }, [authUser])


    
    if (isCheckingAuth && !authUser) return (
        <div className="w-full h-screen flex justify-center items-center text-3xl">Loading...</div>
    )

    return (
        <div className={`${authUser && 'flex gap-2 px-2 bg-slate-950'}`}>
            {authUser && <Navbar navSelectionState={{navSelection, setNavSelection}} />}
            
            <Outlet context={[navSelection, setNavSelection]} />
        </div>
    )
}

export default App
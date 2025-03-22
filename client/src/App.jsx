// Modules
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Store
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";

// Assets
import { FaCircleXmark } from "react-icons/fa6";

function App() {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
    const { messages, chats, showImage, imageUrl, setShowImage, setImageUrl } = useChatStore();

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

            {showImage && <div className="z-99 fixed w-screen h-screen top-0 left-0 flex items-center justify-center backdrop-blur-lg">
                <img className="h-4/6 sm:h-5/6 md:h-full" src={imageUrl} />
                <FaCircleXmark className="absolute top-0 right-0 size-8" onClick={() => {
                    setShowImage(false)
                    setImageUrl(null)
                }} />
            </div>}

        </div>
    )
}

export default App
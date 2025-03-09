// Modules
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Store
import { useAuthStore } from "./store/authStore";

function App() {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

    const [navSelection, setNavSelection] = useState("chat");

    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    useEffect(() => {
        navigate("/");
    }, [])

    useEffect(() => {
        if (authUser) navigate("/");
    }, [authUser])


    
    if (isCheckingAuth && !authUser) return (
        <div className="h-screen bg-green-600">Loading...</div>
    )

    return (
        <div className={`${authUser && 'flex gap-2 px-2 bg-slate-950'}`}>
            {authUser && <Navbar navSelectionState={{navSelection, setNavSelection}} />}
            
            <Outlet context={[navSelection, setNavSelection]} />
        </div>
    )
}

export default App
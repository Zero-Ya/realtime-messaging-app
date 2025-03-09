
// Icons
import { FaRegMessage, FaRegCircleUser, FaPowerOff } from "react-icons/fa6";

// Store
import { useAuthStore } from "../store/authStore";

function Navbar({ navSelectionState }) {
    const { logout } = useAuthStore();

    const { navSelection, setNavSelection } = navSelectionState;

    function fetchLogout() {
        logout();
    }

    return (
        <>
        <div className="w-36 h-screen flex flex-col justify-between px-2 py-4 text-white text-lg">
            <div onClick={() => setNavSelection("chat")} className="flex items-center gap-2">
                <FaRegMessage size={25} />
                <div>Chats</div>
            </div>

            <div className="flex flex-col gap-4">
                <div onClick={() => setNavSelection("profile")} className="flex items-center gap-2">
                    <FaRegCircleUser size={25} />
                    <div>Profile</div>
                </div>

                <div onClick={fetchLogout} className="flex items-center gap-2">
                    <FaPowerOff size={25} />
                    <div>Logout</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Navbar
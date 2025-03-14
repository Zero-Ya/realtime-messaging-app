// 

// Icons
import { FaRegMessage, FaUsers, FaRegCircleUser, FaPowerOff, FaUserGroup } from "react-icons/fa6";

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
            <div className="flex flex-col gap-4">
                <div onClick={() => setNavSelection("chat")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaRegMessage className="size-8" />
                    <div>Chats</div>
                </div>

                <div onClick={() => setNavSelection("group")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaUserGroup className="size-8" />
                    <div>Groups</div>
                </div>

                <div onClick={() => setNavSelection("people")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaUsers className="size-8" />
                    <div>People</div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div onClick={() => setNavSelection("profile")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaRegCircleUser className="size-8" />
                    <div>Profile</div>
                </div>

                <div onClick={fetchLogout} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaPowerOff className="size-8" />
                    <div>Logout</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Navbar
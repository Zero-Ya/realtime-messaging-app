// 

// Icons
import { FaRegMessage, FaUsers, FaRegCircleUser, FaPowerOff, FaUserGroup } from "react-icons/fa6";

// Store
import { useAuthStore } from "../store/authStore";

function Navbar({ navSelectionState }) {
    const { logout, isLoggingOut } = useAuthStore();

    const { navSelection, setNavSelection } = navSelectionState;

    function fetchLogout() {
        logout();
    }

    return (
        <>
        <div className="w-10 sticky top-0 left-0 sm:w-14 md:w-28 lg:w-36 h-dvh flex flex-col justify-between px-2 py-4 text-white text-base lg:text-lg">
            <div className="flex flex-col items-center md:items-baseline gap-4">
                <div onClick={() => setNavSelection("chat")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaRegMessage className="size-6 lg:size-8" />
                    <div className="hidden md:block">Chats</div>
                </div>

                <div onClick={() => setNavSelection("group")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaUserGroup className="size-6 lg:size-8" />
                    <div className="hidden md:block">Groups</div>
                </div>

                <div onClick={() => setNavSelection("people")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaUsers className="size-6 lg:size-8" />
                    <div className="hidden md:block">People</div>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-baseline gap-4">
                <div onClick={() => setNavSelection("profile")} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaRegCircleUser className="size-6 lg:size-8" />
                    <div className="hidden md:block">Profile</div>
                </div>

                <div onClick={fetchLogout} className="flex items-center gap-2 cursor-pointer hover:text-slate-400">
                    <FaPowerOff className="size-6 lg:size-8" />
                    <div className="hidden md:block">{isLoggingOut ? 'Logging out...' : 'Logout'}</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Navbar
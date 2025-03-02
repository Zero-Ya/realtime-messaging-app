// Modules
import { useNavigate } from "react-router-dom";

// Icons
import { FaRegMessage, FaRegCircleUser, FaPowerOff } from "react-icons/fa6";

function Navbar({ socket }) {
    const navigate = useNavigate();

    function fetchLogout() {
        fetch("/api/logout", {
            method: "GET"
        })
        .then(res => {
            if (socket?.connected) socket.disconnect()
            navigate("/login")
        })
        .catch(err => console.log(err))
    }

    return (
        <>
        <div className="w-36 h-screen flex flex-col justify-between px-2 py-4 text-white text-lg">
            <div className="flex items-center gap-2">
                <FaRegMessage size={25} />
                <div>Chats</div>
            </div>


            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <FaRegCircleUser size={25} />
                    <div>Profile</div>
                </div>

                <div className="flex items-center gap-2">
                    <FaPowerOff size={25} />
                    <div onClick={fetchLogout}>Logout</div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Navbar
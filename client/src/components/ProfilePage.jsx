// Modules
import { useState, useEffect } from "react";
import { format, formatDistance } from "date-fns";

// Store
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

// Assets
import avatar from "../assets/avatar.svg";
import { FaCamera, FaRegCircleUser, FaRegIdCard, FaUserGroup } from "react-icons/fa6";

// Components
import ProfileFriend from "./ProfileFriend";

function Profile() {
    const { authUser, isUpdatingProfile, updateProfile, onlineUsers } = useAuthStore();
    const { chats  } = useChatStore();

    const allFriendsFlat = [].concat(...chats?.map((arr) => arr.members));
    const allFriendsExcAuth = allFriendsFlat.filter((id) => id !== authUser.id)

    const [allFriends, setAllFriends] = useState([]);
    
    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageUpload = async(e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({ profileImg: base64Image });
        }
    }

    useEffect(() => {
        fetch("https://realtime-messaging-app-9hpl.onrender.com/api/all-users", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            setAllFriends(data.filter((user) => allFriendsExcAuth.includes(user.id)))
        })
        .catch(err => console.log(err))
    }, [chats])

    return (
        authUser &&
        <div className="w-full h-full lg:h-[calc(100dvh-1rem)] flex flex-col gap-4 items-center my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">

            <div className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold">Profile</div>
            <div className="text-xs sm:text-sm md:text-base text-slate-50">Profile information</div>
            <div className="relative group">
                <img className="size-28 xl:size-32 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                src={selectedImg || authUser.profileImg || avatar} />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer group-hover:bg-slate-400">
                    <FaCamera className="size-6 text-slate-800" />
                    <input className="hidden" type="file" id="avatar-upload" accept="image/*"
                    onChange={handleImageUpload} />
                </label>
            </div>
            <div className="text-xs sm:text-sm md:text-base text-slate-400 text-center">{isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your profile picture'}</div>

            <div className="pt-2 lg:pt-4 w-full flex flex-col lg:flex-row items-center gap-3">
                <div className="w-full lg:w-2/5 h-full flex flex-col gap-3">
                    <div className="flex items-center gap-3 self-start">
                        <FaRegCircleUser className="size-7 sm:size-8" />
                        <div className="text-base sm:text-lg md:text-xl xl:text-2xl">Username:</div>
                    </div>
                    <div className="w-full md:h-full py-4 bg-slate-950 rounded-lg">
                        <div className="h-full flex items-center gap-3 p-2 lg:p-4 mx-4 bg-slate-900 rounded-lg">
                            <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={authUser.profileImg || avatar} />
                            <div className="text-base sm:text-lg md:text-xl xl:text-2xl">{authUser.username}</div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex flex-col gap-3">
                    <div className="flex items-center gap-3 self-start">
                        <FaRegIdCard className="size-7 sm:size-8" />
                        <div className="text-base sm:text-lg md:text-xl xl:text-2xl">Account Information:</div>
                    </div>

                    <div className="w-full h-full py-4 bg-slate-950 rounded-lg">
                        <div className="h-full flex flex-col md:flex-row gap-3 mx-4 md:mx-0 md:gap-0 items-center">
                            <div className="w-full h-full flex items-center gap-3 p-2 lg:p-4 md:ml-4 bg-slate-900 rounded-lg text-base sm:text-lg md:text-xl xl:text-2xl">
                                <div>Member Since:</div>
                                <div>{format(authUser.createdAt, "y-M-d")}</div>
                            </div>
        
                            <div className="w-full h-full flex items-center gap-3 p-2 lg:p-4 mx-4 bg-slate-900 rounded-lg text-base sm:text-lg md:text-xl xl:text-2xl">
                                <div>Account Status:</div>
                                {(onlineUsers.includes(authUser.id.toString())) ? <div className="text-green-600">Online</div> : <div className="text-red-600">Offline</div>}
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <div className="pt-2 lg:pt-4 flex items-center gap-3 self-start">
                <FaUserGroup className="size-7 sm:size-8" />
                <div className="text-base sm:text-lg md:text-xl xl:text-2xl">Friends:</div>
            </div>
            <div className="w-full flex flex-col h-full max-h-52 overflow-y-auto gap-6 py-4 bg-slate-950 rounded-lg">
                {allFriends.map((user) => (
                    <ProfileFriend key={user.id} user={user} />
                ))}
            </div>

        </div>
    )

}

export default Profile
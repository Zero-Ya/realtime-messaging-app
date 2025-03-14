// Modules
import { useState } from "react";

// Store
import { useAuthStore } from "../store/authStore";

// Assets
import avatar from "../assets/avatar.svg";
import { FaCamera } from "react-icons/fa6";

function Profile() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

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

    return (
        authUser &&
        <div className="w-full flex flex-col gap-4 items-center my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">

            <div className="text-3xl font-semibold">Profile</div>
            <div className="text-slate-50">Profile information</div>
            <div className="relative group">
                <img className="size-32 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                src={selectedImg || authUser.profileImg || avatar} />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer group-hover:bg-slate-400">
                    <FaCamera className="size-6 text-slate-800" />
                    <input className="hidden" type="file" id="avatar-upload" accept="image/*"
                    onChange={handleImageUpload} />
                </label>
            </div>
            <div className="text-slate-400">{isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your profile picture'}</div>

            <div>{authUser.username}</div>


        </div>
    )

}

export default Profile
// Modules
import { useState } from "react";

// Store
import { useAuthStore } from "../store/authStore";

// Assets
import avatar from "../assets/avatar.svg";
import { FaCamera } from "react-icons/fa6";

function Profile() {
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()

    const [selectedImg, setSelectedImg] = useState(null)

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
        <div className="w-full flex flex-col items-center my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">

            <div className="relative">
                <img className="size-32 rounded-full object-cover border-4"
                src={selectedImg || authUser.profileImg || avatar} />
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-white p-2 rounded-full">
                    <FaCamera className="size-6 text-slate-800" />
                    <input className="hidden" type="file" id="avatar-upload" accept="image/*"
                    onChange={handleImageUpload} />
                </label>
            </div>


        </div>
    )

}

export default Profile
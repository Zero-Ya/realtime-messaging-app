// Modules
import { useState, useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";
import { FaXmark } from "react-icons/fa6";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useGroupStore } from "../../store/groupStore";

function AddGroupForm({ setAddGroup, setShowGroupChat }) {
    const { authUser, allUsers } = useAuthStore();
    const { createGroup, isCreatingGroup } = useGroupStore();
    const { chats } = useChatStore();

    const allFriendsFlat = [].concat(...chats?.map((arr) => arr.members));
    const allFriendsId = allFriendsFlat.filter((id) => id !== authUser.id)

    const allFriends = allUsers?.filter((user) => allFriendsId.includes(user.id));

    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [groupName, setGroupName] = useState("");
    const [selectMembers, setSelectMembers] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);

    const handleImageUpload = async(e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
        }
    }

    function addSelectedMember(member) {
        setSelectedMembers((m) => [...m, member])
    }

    function removeSelectedMember(memberTBR) {
        setSelectedMembers(selectedMembers.filter((member) => member.id !== memberTBR.id))
    }

    function handleCreateGroup (e, groupName) {
        e.preventDefault();
        const allMembersId = selectedMembers.map((member) => member.id);

        if (groupName === "" || allMembersId.length === 0) return console.log("Please fill the inputs"); 
        // SET STATE TO ERRORS

        createGroup(groupName, allMembersId, selectedImg);
    }

    useEffect(() => {
        const reFilteredUsers = allFriends.filter((user) => !selectedMembers.includes(user));
        setFilteredUsers(reFilteredUsers)
    }, [selectedMembers])

    useEffect(() => {
        setFilteredUsers(allFriends.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
    }, [query])

    return (
        <form className="w-full h-full flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-2">
                    <div className="text-lg sm:text-xl lg:text-2xl">Create Group</div>
                    <FaXmark className="block md:hidden size-6" onClick={() => {
                        setShowGroupChat(false)
                        setAddGroup(false)
                    }}/>
                </div>

                <div className="pt-2 pb-6 border-y">
                    <div className="flex justify-between items-center">
                        <div className="text-lg sm:text-xl lg:text-2xl">Group Profile</div>
                        <label onChange={handleImageUpload} className="bg-white text-black p-2 rounded-lg cursor-pointer">
                            <input className="hidden" type="file" id="group-image-upload" accept="image/*" />
                            <div className="text-base lg:text-lg">Change</div>
                        </label>
                    </div>
            
                    <div className="flex justify-center">
                        <img className="size-24 sm:size-28 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                        src={selectedImg || avatar} />
                    </div>
                </div>
            
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <label htmlFor="groupName">Group name:</label>
                        <input className="p-2 bg-slate-800 rounded-lg border-2 border-slate-600" type="text" id="groupName" name="groupName"
                        value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                    </div>
            
                    <div className="relative flex flex-col gap-2 text-base sm:text-lg">
                        <label htmlFor="groupMembers">Select members:</label>
                        <input onClick={() => setSelectMembers(!selectMembers)} className="p-2 bg-slate-800 rounded-lg border-2 border-slate-600" type="text" id="groupMembers" name="groupMembers"
                        value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Select friends..."/>
                        {(selectMembers && filteredUsers.length !== 0) && <div className="absolute top-20 flex flex-col max-h-44 overflow-y-auto w-full bg-slate-950 border-2 border-slate-600 rounded-lg">
                            {filteredUsers.map((user) =>
                            <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-slate-800" onClick={() => addSelectedMember(user)}>
                                <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                                <div className="text-base sm:text-lg">{user.username}</div>
                            </div>)}
                        </div>}
                    </div>
                            
                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div>Selected members:</div>
                        <div className="h-full max-h-28 overflow-y-auto border-2 border-slate-600 bg-slate-800 rounded-lg">
                            {selectedMembers.map((member) =>
                            <div key={member.id} className="flex items-center justify-between gap-4 p-2">
                                <div className="flex items-center gap-3">
                                    <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                    <div className="text-base sm:text-lg">{member.username}</div>
                                </div>
                                <FaXmark className="size-5 cursor-pointer" onClick={() => removeSelectedMember(member)}/>
                            </div>)}
                        </div>
                    </div>
                </div>

            </div>
                        
            <div className="flex justify-end">
                <button type="submit" onClick={(e) => handleCreateGroup(e, groupName)} className="text-base sm:text-lg lg:text-xl p-2 bg-white text-black rounded-lg">{isCreatingGroup ? 'Creating...' : 'Create Group'}</button>
            </div>
                        
        </form>
    )
}

export default AddGroupForm
// Modules
import { useState, useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";
import { FaXmark, FaPenToSquare } from "react-icons/fa6";

// Store
import { useAuthStore } from "../../store/authStore";
import { useGroupStore } from "../../store/groupStore";
import { useChatStore } from "../../store/chatStore";

function GroupInfo({setShowGroupInfo, selectedGroup, setShowGroupChat }) {
    const { authUser, allUsers } = useAuthStore();
    const { removeMember, isRemovingMember, updateGroupImage, isUpdatingGroupImage, updateGroupName, updateMembers, isUpdatingMembers, deleteGroup ,isDeletingGroup } = useGroupStore();
    const { chats } = useChatStore();

    const allFriendsFlat = [].concat(...chats?.map((arr) => arr.members));
    const allFriendsId = allFriendsFlat.filter((id) => id !== authUser.id).filter((id) => !selectedGroup.members.includes(id)) // Excluding members

    const allFriends = allUsers?.filter((user) => allFriendsId.includes(user.id));

    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [changeName, setChangeName] = useState(false);
    const [groupName, setGroupName] = useState(selectedGroup.name);
    const [addMembers, setAddMembers] = useState(false);

    const [selectMembers, setSelectMembers] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const [selectedImg, setSelectedImg] = useState(null);
    const [allMembers, setAllMembers] = useState([]);

    const [delPopup, setDelPopup] = useState(true);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateGroupImage({ groupImg: base64Image });
        }
    }

    async function handleChangeGroupName() {
        updateGroupName({ newName: groupName })
        setChangeName(false);
    }

    function handleRemoveMember(type, rmId) {
        const newMembers = selectedGroup.members.filter((memberId) => memberId !== rmId);

        if (type === "leave") {
            removeMember(selectedGroup.id, newMembers, type);
            setShowGroupInfo(false);
            setShowGroupChat(false);
        } else {
            removeMember(selectedGroup.id, newMembers, type);
        }
    }

    function addSelectedMember(member) {
        setSelectedMembers((m) => [...m, member])
    }

    function removeSelectedMember(memberTBR) {
        setSelectedMembers(selectedMembers.filter((member) => member.id !== memberTBR.id))
    }

    function handleUpdateMembers() {
        const newMembers = selectedMembers.map((member) => member.id)
        updateMembers(selectedGroup.id, newMembers)
        setAddMembers(false)
    }

    function handleDeleteGroup() {
        setDelPopup(true)
        deleteGroup(selectedGroup.id)
    }

    useEffect(() => {
        setAllMembers(allUsers.filter((user) => selectedGroup.members.includes(user.id)));

        setSelectedMembers(allUsers.filter((user) => selectedGroup.members.includes(user.id)));
    }, [allUsers, selectedGroup])

    useEffect(() => {
        const reFilteredUsers = allFriends.filter((user) => !selectedMembers.includes(user));
        setFilteredUsers(reFilteredUsers)
    }, [selectedMembers])

    useEffect(() => {
        setFilteredUsers(allFriends.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
    }, [query, allMembers])


    if (authUser.id === selectedGroup.adminId) return (
        <div className="w-full h-full flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-2">
                    <div className="text-lg sm:text-xl lg:text-2xl">Group Info</div>
                    <FaXmark className="size-8" onClick={() => setShowGroupInfo(false)}/>
                </div>

                <div className="pt-2 pb-6 border-y">
                    <div className="flex justify-between items-center">
                        <div className="text-lg sm:text-xl lg:text-2xl">Group Profile</div>
                        <label onChange={handleImageUpload} className="bg-white text-black p-2 rounded-lg cursor-pointer">
                            <input className="hidden" type="file" id="group-image-upload" accept="image/*" />
                            <div className="text-base lg:text-lg">{isUpdatingGroupImage ? 'Changing...' : 'Change'}</div>
                        </label>
                    </div>
                        
                    <div className="flex justify-center">
                        <img className="size-24 sm:size-28 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                        src={selectedImg || selectedGroup?.groupImg || avatar} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div className={`${changeName ? 'hidden' : 'flex'}`}>Group name:</div>
                        <div className={`${changeName ? 'hidden' : 'flex'} justify-between items-center p-2 bg-slate-800 rounded-lg border-2 border-slate-600`}>
                            <div>{selectedGroup?.name}</div>
                            <FaPenToSquare className="size-5" onClick={() => setChangeName(true)} />
                        </div>

                        <label className={`${changeName ? 'flex' : 'hidden'}`} htmlFor="groupName">Group name:</label>
                        <div className={`${changeName ? 'flex' : 'hidden'} justify-between items-center gap-4 p-2 bg-slate-800 rounded-lg border-2 border-slate-600`}>
                            <input className="w-full bg-slate-800" type="text" id="groupName" name="groupName"
                            value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                            <button className="font-semibold cursor-pointer" onClick={handleChangeGroupName}>Done</button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div className="flex justify-between items-center gap-3">
                            <div>Members Info:</div>
                            <div className="font-semibold" onClick={() => setAddMembers(!addMembers)}>Edit Members</div>
                        </div>

                        {!addMembers &&
                        <div className="h-full max-h-44 overflow-y-auto border-2 border-slate-600 bg-slate-800 rounded-lg">
                            {allMembers.map((member) =>
                            member.id ===selectedGroup.adminId ?
                            <div key={member.id} className="flex justify-between items-center gap-3 p-2">
                                <div className="flex items-center gap-3">
                                    <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                    <div className="text-base sm:text-lg">{member.username}</div>
                                </div>
                                <div className="text-sky-600 font-semibold">Admin</div>
                            </div>
                            :
                            <div key={member.id} className="flex justify-between items-center gap-3 p-2">
                                <div key={member.id} className="flex items-center gap-3">
                                    <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                    <div className="text-base sm:text-lg">{member.username}</div>
                                </div>
                            </div>)}
                        </div>}

                    </div>

                    {addMembers && <>
                    <div className="relative flex flex-col gap-2 text-lg">
                        <label htmlFor="groupMembers">Add member:</label>
                        <input onClick={() => setSelectMembers(!selectMembers)} className="p-2 bg-slate-800 rounded-lg border-2 border-slate-600" type="text" id="groupMembers" name="groupMembers"
                        value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Select friends..."/>
                        {(selectMembers && filteredUsers.length !== 0) && <div className="absolute top-20 flex flex-col max-h-32 overflow-y-auto w-full bg-slate-950 border-2 border-slate-600 rounded-lg">
                            {filteredUsers.map((user) =>
                            <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-slate-800" onClick={() => addSelectedMember(user)}>
                                <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                                <div className="text-base sm:text-lg">{user.username}</div>
                            </div>)}
                        </div>}
                    </div>

                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div className="flex justify-between items-center gap-3">
                            <div>Members:</div>
                            <div className="font-semibold cursor-pointer" onClick={handleUpdateMembers}>{isUpdatingMembers ? 'Updating...' : 'Confirm'}</div>
                        </div>

                            <div className="h-full max-h-28 overflow-y-auto border-2 border-slate-600 bg-slate-800 rounded-lg">
                                {selectedMembers.map((member) =>
                                <div key={member.id} className="flex items-center justify-between gap-4 p-2">
                                    <div className="flex items-center gap-3">
                                        <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                        <div className="text-base sm:text-lg">{member.username}</div>
                                    </div>
                                    {!(member.id === selectedGroup.adminId) && (
                                    selectedGroup.members.includes(member.id) ?
                                    <div className="text-red-600 font-semibold cursor-pointer" onClick={() => handleRemoveMember("remove", member.id)}>Remove</div>
                                    :
                                    <FaXmark className="size-5 cursor-pointer" onClick={() => removeSelectedMember(member)}/>)}
                                </div>)}
                            </div>
                    </div>
                    </>}


                </div>
            </div>

            <div className="flex justify-end text-base sm:text-lg lg:text-xl">
                {delPopup ?
                <button className="text-white bg-red-600 p-2 rounded-lg cursor-pointer" onClick={() => setDelPopup(false)}>{isDeletingGroup ? 'Deleting...' : 'Delete Group'}</button>
                :
                <div className="flex items-center gap-2">
                    <div className="text-white bg-red-600 p-2 rounded-lg cursor-pointer" onClick={() => handleDeleteGroup()}>Confirm</div>
                    <div className="text-black bg-white p-2 rounded-lg cursor-pointer" onClick={() => setDelPopup(true)}>Cancel</div>
                </div>}
            </div>

        </div>
    )

//

    return (
        <div className="w-full h-full flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center gap-2">
                    <div className="text-lg sm:text-xl lg:text-2xl">Group Info</div>
                    <FaXmark className="size-8" onClick={() => setShowGroupInfo(false)}/>
                </div>

                <div className="pt-2 pb-6 border-y">
                    <div className="flex justify-between items-center">
                        <div className="text-lg sm:text-xl lg:text-2xl">Group Profile</div>
                    </div>
                        
                    <div className="flex justify-center">
                        <img className="size-24 sm:size-28 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                        src={selectedGroup?.groupImg || avatar} />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div>Group name:</div>
                        <div className="p-2 bg-slate-800 rounded-lg border-2 border-slate-600">{selectedGroup?.name}</div>
                    </div>

                    <div className="flex flex-col gap-2 text-base sm:text-lg">
                        <div>Members:</div>
                        <div className="h-full max-h-44 overflow-y-auto border-2 border-slate-600 bg-slate-800 rounded-lg">
                            {allMembers.map((member) =>
                            member.id ===selectedGroup.adminId ?
                            <div key={member.id} className="flex justify-between items-center gap-3 p-2">
                                <div className="flex items-center gap-3">
                                    <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                    <div className="text-base sm:text-lg">{member.username}</div>
                                </div>
                                <div className="text-sky-600 font-semibold">Admin</div>
                            </div>
                            :
                            <div key={member.id} className="flex items-center gap-3 p-2">
                                <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                                <div className="text-base sm:text-lg">{member.username}</div>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="text-base sm:text-lg lg:text-xl text-white bg-red-600 p-2 rounded-lg" onClick={() => handleRemoveMember("leave", authUser.id)}>{isRemovingMember ? 'Leaving Group...' : 'Leave Group'}</button>
            </div>
        </div>
    )
}

export default GroupInfo
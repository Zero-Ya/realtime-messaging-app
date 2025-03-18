// Modules
import { useState, useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";

// Store
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useGroupStore } from "../../store/groupStore";

function AddGroupForm() {
    const { authUser } = useAuthStore();
    const { createGroup, isCreatingGroup } = useGroupStore();
    const { chats } = useChatStore();

    const allFriendsFlat = [].concat(...chats?.map((arr) => arr.members));
    const allFriends = allFriendsFlat.filter((id) => id !== authUser.id)

    const [query, setQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [queryFilteredUsers, setQueryFilteredUsers] = useState([]);

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

    function handleCreateGroup (e, groupName) {
        e.preventDefault();
        const allMembersId = selectedMembers.map((member) => member.id);

        if (groupName === "" || allMembersId.length === 0) return console.log("Please fill the inputs"); 
        // SET STATE TO ERRORS

        createGroup(groupName, allMembersId, selectedImg);
    }
    
    useEffect(() => {
        fetch("/api/all-users", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            // setAllUsers(data)
            setFilteredUsers(data.filter((user) => allFriends.includes(user.id)))
            setQueryFilteredUsers(data.filter((user) => allFriends.includes(user.id)))
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        setFilteredUsers(filteredUsers.filter((user) => !selectedMembers.includes(user)))
        setQueryFilteredUsers(filteredUsers.filter((user) => !selectedMembers.includes(user)))
    }, [selectedMembers])

    useEffect(() => {
        setQueryFilteredUsers(filteredUsers.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
    }, [query])

    return (
        <form className="w-full h-full flex flex-col justify-between">
            <div className="text-2xl mb-4">Create Group</div>

            <div>
                <div className="pt-2 pb-6 border-y">
                    <div className="flex justify-between items-center text-lg">
                        <div className="text-2xl">Group Profile</div>
                        <label onChange={handleImageUpload} className="bg-white text-black p-2 rounded-lg cursor-pointer">
                            <input className="hidden" type="file" id="group-image-upload" accept="image/*" />
                            <div>Change</div>
                        </label>
                    </div>

                    <div className="flex justify-center">
                        <img className="size-44 rounded-full object-cover border-4 bg-slate-800 group-hover:border-slate-400"
                        src={selectedImg || avatar} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-2 text-lg">
                        <label htmlFor="groupName">Group name:</label>
                        <input className="p-1 bg-slate-800 rounded-lg border-2 border-slate-600" type="text" id="groupName" name="groupName"
                        value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                    </div>

                    <div className="relative flex flex-col gap-2 text-lg">
                        <label htmlFor="groupMembers">Select members:</label>
                        <input onClick={() => setSelectMembers(!selectMembers)} className="p-1 bg-slate-800 rounded-lg border-2 border-slate-600" type="text" id="groupMembers" name="groupMembers"
                        value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Select friends..."/>
                        {(selectMembers && filteredUsers.length !== 0) && <div className="absolute top-20 flex flex-col gap-4 h-26 overflow-y-auto w-full bg-slate-950 border-2 border-slate-600 rounded-lg p-3">
                            {queryFilteredUsers.map((user) =>
                            <div key={user.id} className="flex items-center gap-2" onClick={() => addSelectedMember(user)}>
                                <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={user.profileImg || avatar} />
                                <div className="text-lg">{user.username}</div>
                            </div>)}
                        </div>}
                    </div>
                            
                    <div className="h-32 overflow-y-auto flex flex-col gap-4 text-lg mt-4">
                        {selectedMembers.map((member) =>
                        <div key={member.id} className="flex items-center gap-2">
                            <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={member.profileImg || avatar} />
                            <div className="text-lg">{member.username}</div>
                        </div>)}
                    </div>
                </div>
            </div>
                        
            <div className="flex justify-end mt-2">
                <button type="submit" onClick={(e) => handleCreateGroup(e, groupName)} className="text-xl p-2 bg-white text-black rounded-lg">{isCreatingGroup ? 'Creating...' : 'Create Group'}</button>
            </div>
                        
        </form>
    )
}

export default AddGroupForm
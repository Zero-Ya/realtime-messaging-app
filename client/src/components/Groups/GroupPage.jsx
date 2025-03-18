// Modules
import { useState, useEffect } from "react";

// Components
import GroupChatPlace from "./GroupChatPlace";
import AddGroupForm from "../Groups/AddGroupForm";

// Assets
import { FaUserGroup, FaPlus } from "react-icons/fa6";
import avatar from "../../assets/avatar.svg";

// Store
import { useAuthStore } from "../../store/authStore";
import { useGroupStore } from "../../store/groupStore";

function GroupPage() {
    const { authUser } = useAuthStore();
    const { selectedGroup, setSelectedGroup, groups, getAllGroups, isGettingGroups } = useGroupStore()

    // const [allUsers, setAllUsers] = useState([]);

    const groupsUserIn = groups.filter((group) => group.members.includes(authUser?.id))
    const [addGroup, setAddGroup] = useState(false);

    function groupOnClick(group) {
        setSelectedGroup(group)
    }

    useEffect(() => {
        getAllGroups();
    }, [])

    return (
        authUser &&
        <div className="w-full flex gap-2">
            <div className="w-80 flex flex-col gap-3 my-2 py-2 bg-slate-900 text-white rounded-lg">
                <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-2">
                        <FaUserGroup className="size-10"/>
                        <div className="text-2xl font-semibold">Groups</div>
                    </div>

                    <FaPlus onClick={() => setAddGroup(!addGroup)} className={`size-6 ${addGroup && 'rotate-45'}`} />
                </div>

                <div className="max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col">
                    {groupsUserIn?.map((group) => 
                    isGettingGroups ? 
                    <div key={group.id} className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <img className="size-8 rounded-full object-cover border-2" src={avatar} />
                            <div className="text-xl">Loading...</div>
                        </div>    
                    </div>
                    :
                    <div key={group.id} className={`px-4 py-3 hover:bg-slate-800 ${selectedGroup?.id === group.id && 'bg-slate-800'}`} onClick={() => groupOnClick(group)}>
                        <div className="flex items-center gap-3">
                            <img className="size-8 rounded-full object-cover border-2 bg-slate-800" src={group.groupImg || avatar} />
                            <div className="text-xl">{group.name}</div>
                        </div>
                    </div>)}
                </div>
                
            </div>

            {/*  */}

            <div className="w-full flex flex-col gap-4 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg">
                {addGroup && <AddGroupForm />}
                {(!addGroup && selectedGroup !== null) && <GroupChatPlace />}
            </div>
        </div>
    )
}

export default GroupPage
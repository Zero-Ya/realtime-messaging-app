// Modules
import { useState, useEffect } from "react";

// Components
import GroupChatPlace from "./GroupChatPlace";
import AddGroupForm from "../Groups/AddGroupForm";

// Assets
import { FaUserGroup, FaPlus } from "react-icons/fa6";

// Store
import { useAuthStore } from "../../store/authStore";
import { useGroupStore } from "../../store/groupStore";

function GroupPage() {
    const { authUser } = useAuthStore();
    const { selectedGroup, setSelectedGroup, groups, getAllGroups } = useGroupStore()

    // const [allUsers, setAllUsers] = useState([]);

    const [addGroup, setAddGroup] = useState(false);

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

                <div className="flex flex-col gap-2">
                    {groups?.map((group) => 
                    <div key={group.id} className="bg-slate-600 p-4" onClick={() => setSelectedGroup(group)}>
                        <div className="text-lg">{group.name}</div>

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
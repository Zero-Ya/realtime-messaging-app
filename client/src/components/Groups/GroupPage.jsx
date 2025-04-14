// Modules
import { useState, useEffect } from "react";

// Components
import GroupChatPlace from "./GroupChatPlace";
import AddGroupForm from "../Groups/AddGroupForm";
import GroupLatestMessage from "./GroupLatestMessage";

// Assets
import { FaUserGroup, FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import avatar from "../../assets/avatar.svg";

// Store
import { useAuthStore } from "../../store/authStore";
import { useGroupStore } from "../../store/groupStore";

function GroupPage() {
    const { authUser } = useAuthStore();
    const { selectedGroup, setSelectedGroup, groups, getAllGroups, isGettingGroups } = useGroupStore()

    const [showGroupChat, setShowGroupChat] = useState(false);
    const [showGroupInfo, setShowGroupInfo] = useState(false);

    const [query, setQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState([]);

    const groupsUserIn = groups.filter((group) => group.members.includes(authUser?.id))
    const [addGroup, setAddGroup] = useState(false);

    function groupOnClick(group) {
        setSelectedGroup(group)
    }

    useEffect(() => {
        getAllGroups();
    }, [])

    useEffect(() => {
        setFilteredGroups(groupsUserIn)
    }, [groups])

    useEffect(() => {
        setFilteredGroups(groupsUserIn.filter((group) => group.name.toLowerCase().includes(query.toLowerCase())))
    }, [query])

    return (
        authUser &&
        <div className="w-full flex gap-2">
            <div className={`${showGroupChat ? 'hidden' : 'flex'} w-full md:w-48 lg:w-80 md:flex flex-col gap-3 my-2 py-2 bg-slate-900 text-white rounded-lg`}>
                <div className="flex justify-between items-center gap-4 px-4">
                    <div className="flex items-center gap-2 py-2 md:py-0">
                        <FaUserGroup className="size-6 lg:size-10"/>
                        <div className="text-xl lg:text-2xl font-semibold">Groups</div>
                    </div>

                    <FaPlus onClick={() => {
                        setShowGroupChat(!showGroupChat)
                        setAddGroup(!addGroup)
                    }}
                    className={`size-6 md:size-4 lg:size-6 ${addGroup && 'md:rotate-45'}`} />
                </div>

                <div className="max-w-full md:max-w-64 flex items-center gap-2 px-4 md:px-2 lg:px-4 mx-3 md:mx-2 lg:mx-3 mt-2 bg-slate-800 rounded-lg border-2 border-slate-600">
                    <label htmlFor="search-bar"><FaMagnifyingGlass className="size-5 md:size-4 lg:size-5 cursor-pointer" /></label>
                    <input className="w-full text-lg md:text-base lg:text-lg text-white p-2 md:p-1 bg-slate-800" type="search" placeholder="Search Contact" id="search-bar"
                    onChange={(e) => setQuery(e.target.value)} value={query}/>
                </div>

                <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto flex flex-col">
                    {filteredGroups?.map((group) => 
                    isGettingGroups ? 
                    <div key={group.id} className="px-4 py-3">
                        <div className="flex items-center gap-3">
                            <img className="size-8 rounded-full object-cover border-2" src={avatar} />
                            <div className="text-lg lg:text-xl">Loading...</div>
                        </div>    
                    </div>
                    :
                    <div key={group.id} className={`px-4 py-3 hover:bg-slate-800 ${selectedGroup?.id === group.id && 'md:bg-slate-800'}`} onClick={() => {
                            setShowGroupChat(true)
                            setShowGroupInfo(false)
                            groupOnClick(group)
                        }}>
                        <div className="flex items-center gap-3">
                            <img className="size-10 rounded-full object-cover border-2 bg-slate-800" src={group.groupImg || avatar} />
                            <div className="flex flex-col gap-1 w-40 sm:w-96 md:w-12 lg:w-28 xl:w-36">
                                <div className="text-lg lg:text-xl">{group.name}</div>
                                <GroupLatestMessage groupId={group.id}/>
                            </div>
                        </div>
                    </div>)}

                    {filteredGroups.length === 0 &&  <div className="flex justify-center text-xl lg:text-2xl font-semibold">No groups</div>}
                </div>
                
            </div>

            {/*  */}

            <div className={`${!showGroupChat ? 'hidden' : 'flex'} w-full h-dvh md:flex flex-col gap-4 my-2 py-2 px-4 bg-slate-900 text-white rounded-lg`}>
                {addGroup && <AddGroupForm setAddGroup={setAddGroup} setShowGroupChat={setShowGroupChat}/>}
                {(!addGroup && selectedGroup !== null) && <GroupChatPlace showGroupChatState={[showGroupChat, setShowGroupChat]} showGroupInfoState={[showGroupInfo, setShowGroupInfo]} />}
            </div>
        </div>
    )
}

export default GroupPage
// Modules
import { useEffect, useRef } from "react";

// Assets
import avatar from "../../assets/avatar.svg";
import cool_background from "../../assets/cool-background.png";

// Components
import GroupMessage from "./GroupMessage";
import MessageForm from "../MessageForm";

// Store
import { useGroupStore } from "../../store/groupStore";

function GroupChatPlace() {
    const { selectedGroup, getGroupMessages, isGroupMessagesLoading, groupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages } = useGroupStore();

    const messageEndRef = useRef(null);

    useEffect(() => {
        if (messageEndRef.current && groupMessages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [groupMessages])

    useEffect(() => {
        if (!selectedGroup) return
        // getAllGroups();
        getGroupMessages();
        subscribeToGroupMessages();
        
        return () => unsubscribeFromGroupMessages();
    }, [selectedGroup])

    return (
        <>
            {(selectedGroup?.id) &&
            <div className="flex items-center gap-3">
                <img className="size-8 rounded-full object-cover border-2 bg-slate-800" src={selectedGroup?.groupImg || avatar} />
                <div className="text-2xl">{selectedGroup?.name}</div>
            </div>}

            <div className="h-full flex flex-col justify-between gap-4">
                <div className={`relative h-[calc(100vh-9rem)]`}>
                    {!isGroupMessagesLoading && <img className="absolute w-full h-full object-cover opacity-50 inset-0 rounded-lg" src={cool_background} />}

                    <div className={`h-full overflow-y-auto p-4 relative flex flex-col gap-6 ${isGroupMessagesLoading || groupMessages.length === 0 ? `justify-center` : `justify-normal`}`}>
                        {(isGroupMessagesLoading) ? <div className="self-center text-xl">Loading...</div> :
                        groupMessages.length === 0 ? <div className="bg-slate-800 p-4 rounded-lg text-center self-center text-xl">Say hi to the conversation!</div> :
                        groupMessages?.map((message) => <GroupMessage key={message.id} message={message} messageEndRef={messageEndRef} />)}
                    </div>
                </div>

                <MessageForm selectedType={"group"} />
            </div>
        </>
    )
}

export default GroupChatPlace
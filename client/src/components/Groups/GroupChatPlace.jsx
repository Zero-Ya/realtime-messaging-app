// Modules
import { useEffect } from "react";

// Assets
import avatar from "../../assets/avatar.svg";
import cool_background from "../../assets/cool-background.png";

// Components
import MessageForm from "../MessageForm";

// Store
import { useGroupStore } from "../../store/groupStore";

function GroupChatPlace() {
    const { selectedGroup, getGroupMessages, groupMessages } = useGroupStore();

    useEffect(() => {
        if (selectedGroup) {
            getGroupMessages();
        }
    }, [selectedGroup])

    return (
        <>
            {(selectedGroup?.id) &&
            <div className="flex items-center gap-3">
                <img className="size-8 rounded-full object-cover border-2 bg-slate-800" src={avatar} />
                <div className="text-2xl">{selectedGroup?.name}</div>
            </div>}

            <div className="h-full flex flex-col justify-between gap-4">
                <div className={`relative h-[calc(100vh-9rem)]`}>
                    <img className="absolute w-full h-full object-cover opacity-50 inset-0 rounded-lg" src={cool_background} />

                    <div className={`h-full overflow-y-auto p-4 relative flex flex-col gap-6`}>
                        {groupMessages?.map((message) => <div>{message.text}</div>)}
                    </div>
                </div>

                <MessageForm selectedType={"group"} />
            </div>
        </>
    )
}

export default GroupChatPlace
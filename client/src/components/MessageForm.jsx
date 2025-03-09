// Modules
import { useState, useRef } from "react";

// Store
import { useChatStore } from "../store/chatStore";

// Assets
import { FaRegImage, FaRegPaperPlane, FaCircleXmark } from "react-icons/fa6";

function MessageForm() {
    const { isMessagesLoading ,sendMessage } = useChatStore();

    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);



    function handleImageChange(e) {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) return console.log("Please select an image file");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    function removeImage() {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function handleSendMessage(e) {
        e.preventDefault();
        if (!message.trim() && !imagePreview) return

        sendMessage({ text: message.trim(), image: imagePreview });

        setMessage("");
        removeImage();
    }

    return (
        !isMessagesLoading &&
        <div className="relative">
            {imagePreview && <>
                <div className="absolute -top-44">
                    {/* <div className="relative"> */}
                        <img className="size-40 object-cover rounded-lg border-2" src={imagePreview} alt="Preview" />
                        <button className="absolute -top-1.5 -right-1.5 bg-black" onClick={removeImage}><FaCircleXmark className="size-4" /></button>
                    {/* </div> */}
                </div>
            </>}

            <form className="flex justify-between items-center gap-8">
                <input autoFocus className="grow p-2 bg-slate-800 rounded-lg" type="text" id="message" name="message" value={message}
                placeholder="Type a message..." onChange={(e) => setMessage(e.target.value)} />

                <div className="flex items-center gap-8">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                        <FaRegImage className={`size-6 cursor-pointer ${imagePreview && 'text-sky-600'}`} />
                    </button>

                    <button disabled={!message.trim() && !imagePreview} type="submit" onClick={handleSendMessage}>
                        <FaRegPaperPlane className={`size-6 cursor-pointer ${(!message.trim() && !imagePreview) && 'text-slate-600'}`}/>
                    </button>
                    {/* Try to break this code but clicking enter mulitple times */}
                </div>
            </form>
        </div>
    )
}

export default MessageForm
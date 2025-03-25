const prisma = require("../db/prismaClient");
const { io, getReceiverSocketId } = require("../lib/socket");
const cloudinary = require("../lib/cloudinary");

exports.postMessage = async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const senderId = req.user.id;
        const receiverId = parseInt(req.params.receiverId);

        const { text } = req.body;
        const file = req.file;

        let fileUrl;
        let fileSize;
        if (file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path);
            fileUrl = uploadResponse.secure_url
            fileSize = file.size
        }
        // Update user chat to the top of the list
        await prisma.chat.update({
            data: { updatedAt: new Date() },
            where: { id: chatId }
        })

        const message = await prisma.message.create({
            data: {
                chatId,
                senderId,
                receiverId,
                text,
                file: fileUrl,
                fileSize
            }
        })
        res.status(200).json(message);

        // Send message real time using socket.io
        // const receiverSocketId = getReceiverSocketId(receiverId)
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("newMessage", message);
        //     io.to(receiverSocketId).emit("refreshChats", { msg: "Refreshing..." });
        // }
        
        io.emit("newMessage", message);
        io.emit("refreshChats", { message: "Refreshing..." });

    } catch (error) {
        console.log("Error in postMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.postGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const senderId = req.user.id;

        const { text } = req.body;
        const file = req.file;

        let fileUrl;
        let fileSize;
        if (file) {
            const uploadResponse = await cloudinary.uploader.upload(req.file.path);
            fileUrl = uploadResponse.secure_url
            fileSize = file.size
        }

        if (!senderId) return res.json({ msg: "No user found" });

        // Update user chat to the top of the list
        await prisma.group.update({
            data: { updatedAt: new Date() },
            where: { id: parseInt(groupId) }
        })

        const message = await prisma.groupMessage.create({
            data: {
                groupId: parseInt(groupId),
                senderId,
                text,
                file: fileUrl,
                fileSize
            }
        })
        res.status(200).json(message);

        // Send message real time using socket.io
        io.in(message.groupId).emit("send-channel-message", message);
        io.emit("refreshGroupChats", { message: "Refreshing..." });

    } catch (error) {
        console.log("Error in postGroupMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
    
        const messages = await prisma.groupMessage.findMany({
            where: { groupId: parseInt(groupId) },
            orderBy: { createdAt: "asc" }
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getGroupMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getChatMessages = async (req ,res) => {
    try {
        const authUserId = req.user.id;
        const otherUserId = parseInt(req.params.userId);
    
        const chat = await prisma.chat.findFirst({
            where: { members: { hasEvery: [authUserId, otherUserId] } }
        })
        
        const messages = await prisma.message.findMany({
            where: { chatId: chat.id },
            orderBy: { createdAt: "asc" }
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getChatMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
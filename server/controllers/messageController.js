const prisma = require("../db/prismaClient");
const { io, getReceiverSocketId } = require("../lib/socket");
const cloudinary = require("../lib/cloudinary");

exports.postMessage = async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const senderId = req.user.id;
        const receiverId = parseInt(req.params.receiverId);

        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        if (senderId) {
            // Update user chat to the top of the list
            await prisma.chat.update({
                data: { updatedAt: new Date() },
                where: { id: chatId }
            })

            const message = await prisma.message.create({
                data: {
                    chatId ,
                    senderId ,
                    receiverId,
                    text,
                    image: imageUrl
                }
            })
            res.json(message)

            // Send message real time using socket.io
            const receiverSocketId = getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", message);
                io.to(receiverSocketId).emit("refreshChats", { msg: "Refreshing..." });
            }
        } else res.json({ msg: "No user found" });

    } catch (error) {
        console.log("Send message error", error)
    }
}

exports.postGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const senderId = req.user.id;

        const { text, image } = req.body;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
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
                image: imageUrl
            }
        })
        res.json(message)

    } catch (error) {
        console.log("Send group message error", error)
    }
}

exports.getGroupMessages = async (req, res) => {
    const authUserId = req.user.id;
    const { groupId } = req.params;
    if (!authUserId) return res.json({ msg: "No user found" });

    const messages = await prisma.groupMessage.findMany({
        where: { groupId: parseInt(groupId) },
        orderBy: { createdAt: "asc" }
    })
    res.json(messages)
}

exports.getChatMessages = async (req ,res) => {
    const authUserId = req.user.id;
    const otherUserId = parseInt(req.params.userId);

    if (req.user) {
        const chat = await prisma.chat.findFirst({
            where: { members: { hasEvery: [authUserId, otherUserId] } }
        })
        
        const messages = await prisma.message.findMany({
            where: { chatId: chat.id },
            orderBy: { createdAt: "asc" }
        })

        res.json(messages)
    } else res.json({ msg: "Get chat messages went wrong" })

}
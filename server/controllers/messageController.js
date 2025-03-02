const prisma = require("../db/prismaClient");
const { io, getReceiverSocketId } = require("../lib/socket");

exports.postMessage = async (req ,res) => {
    const chatId = parseInt(req.params.chatId);
    const senderId = req.user.id;
    const receiverId = parseInt(req.params.receiverId);

    if (senderId) {
        const message = await prisma.message.create({
            data: {
                chatId ,
                senderId ,
                text: req.body.text
            }
        })
        res.json(message)

        // Send message real time using socket.io
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

    } else res.json({ msg: "No user found" })
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
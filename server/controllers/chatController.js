import prisma from "../db/prismaClient";
import { io, getReceiverSocketId } from "../lib/socket";

getAllChats = async (req, res) => {
    try {
        const allChats = await prisma.chat.findMany({
            where: {
                members: {
                    has: req.user.id
                }
            },
            orderBy: { updatedAt: "desc" }
        });
        res.status(200).json(allChats);
    } catch (error) {
        console.log("Error in getAllChats controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

createChat = async (req, res) => {
    try {
        const otherUser = await prisma.user.findUnique({
            where: { username: req.body.username }
        })
    
        const findChat = await prisma.chat.findFirst({
            where: {
                members: {
                    hasEvery: [req.user.id, otherUser.id]
                }
            }
        })
        if (findChat) return res.json({ message: "Chat already exists" });
    
        const newChat = await prisma.chat.create({
            data: {
                members: [req.user.id, otherUser.id]
            }
        })
        res.status(200).json(newChat)

        const receiverSocketId = getReceiverSocketId(otherUser.id)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("refreshChats", { msg: "Refreshing..." });
        }
    } catch (error) {
        console.log("Error in createChat controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

getUserChatList = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        const userChat = await prisma.user.findUnique({
            where: { id: userId }
        })
        res.status(200).json(userChat);
    } catch (error) {
        console.log("Error in getUserChatList controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

getChat = async (req, res) => {
    try {
        const authUserId = parseInt(req.params.authUserId);
        const selectedUserId = parseInt(req.params.selectedUserId);
    
        const chat = await prisma.chat.findFirst({
            where: {
                members: { hasEvery: [authUserId, selectedUserId] }
            }
        })
        
        res.status(200).json(chat);
    } catch (error) {
        console.log("Error in getChat controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

removeChat = async (req, res) => {
    try {
        const { userId } = req.body;
        const authUserId = req.user.id;
    
        const chat = await prisma.chat.findFirst({
            where: {
                members: { hasEvery: [authUserId, userId] }
            }
        })
    
        if (!chat) return res.json({ message: "No chat to be deleted" });
        
        await prisma.message.deleteMany({
            where: { chatId: chat.id }
        })
        const delChat = await prisma.chat.delete({
            where: { id: chat.id }
        })
        res.status(200).json(delChat)
    
        const receiverSocketId = getReceiverSocketId(userId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("refreshChats", { msg: "Refreshing..." });
        }
    } catch (error) {
        console.log("Error in removeChat controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    getAllChats,
    createChat,
    getUserChatList,
    getChat,
    removeChat
}
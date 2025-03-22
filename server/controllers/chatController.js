const prisma = require("../db/prismaClient");
const { io, getReceiverSocketId } = require("../lib/socket");

exports.getAllChats = async (req, res) => {
    if (req.user) {
        const allChats = await prisma.chat.findMany({
            where: {
                members: {
                    has: req.user.id
                }
            },
            orderBy: { updatedAt: "desc" }
        });
        res.json(allChats);
    } else res.json({msg: "No user found"})
}

exports.createChat = async (req, res) => {
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
    if (findChat) return res.json({ msg: "Chat already exists" });

    if (req.user && otherUser) {
        const newChat = await prisma.chat.create({
            data: {
                members: [req.user.id, otherUser.id]
            }
        })
        res.json(newChat)
    } else res.json({msg: "No users found"})
}

exports.getUserChatList = async (req, res) => {
    const userId = parseInt(req.params.userId);

    const userChat = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (userChat) res.json(userChat)
    else res.json({ msg: "No user found" })
}

exports.getChat = async (req, res) => {
    const authUserId = parseInt(req.params.authUserId);
    const selectedUserId = parseInt(req.params.selectedUserId);

    const chat = await prisma.chat.findFirst({
        where: {
            members: { hasEvery: [authUserId, selectedUserId] }
        }
    })
    
    if (chat) res.json(chat)
    else res.json({ msg: "Chat not found" })
}

exports.removeChat = async (req, res) => {
    const { userId } = req.body;
    const authUserId = req.user.id;

    if (!authUserId) return res.json({ msg: "No user found" });

    const chat = await prisma.chat.findFirst({
        where: {
            members: { hasEvery: [authUserId, userId] }
        }
    })

    if (!chat) return res.json("No chat to be deleted");
    
    await prisma.message.deleteMany({
        where: { chatId: chat.id }
    })
    const delChat = await prisma.chat.delete({
        where: { id: chat.id }
    })
    res.json(delChat)

    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("refreshChats", { msg: "Refreshing..." });
    }
}
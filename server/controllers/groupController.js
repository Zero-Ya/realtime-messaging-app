const prisma = require("../db/prismaClient");
const cloudinary = require("../lib/cloudinary");
const { io } = require("../lib/socket");

exports.createGroup = async (req, res) => {
    const { groupName, membersId, groupImg } = req.body;
    if (!req.user) return res.json({ msg: "No user found" });

    let imageUrl;
    if (groupImg) {
        const uploadResponse = await cloudinary.uploader.upload(groupImg)
        imageUrl = uploadResponse.secure_url
    }

    const newGroup = await prisma.group.create({
        data: {
            name: groupName,
            adminId: req.user.id,
            members: membersId,
            groupImg: imageUrl
        }
    })
    res.json(newGroup)
}

exports.getAllGroups = async (req, res) => {
    const allGroups = await prisma.group.findMany({
        orderBy: { updatedAt: "desc" }
    })
    res.json(allGroups)
}

exports.updateGroupImage = async (req, res) => {
    const { groupImg } = req.body;
    const { groupId } = req.params;
    const authUserId = req.user.id;

    if (!groupImg) return res.json({ msg: "No group image is given" });

    const uploadResponse = await cloudinary.uploader.upload(groupImg);

    if (authUserId) {
        const updatedGroup = await prisma.group.update({
            data: {
                groupImg: uploadResponse.secure_url
            },
            where: { id: parseInt(groupId) }
        })
        res.json(updatedGroup)
    } else res.json({ msg: "No user found" })
}

exports.updateGroupName = async (req, res) => {
    const { groupId } = req.params;
    const { newName } = req.body;
    const authUserId = req.user.id;

    if (!authUserId) return res.json({ msg: "No user found" });

    const updatedGroup = await prisma.group.update({
        data: {
            name: newName
        },
        where: {
            id: parseInt(groupId)          
        }
    })
    res.json(updatedGroup);
}

exports.removeMember = async (req, res) => {
    const { groupId } = req.params;
    const { newMembers } = req.body;
    const authUserId = req.user.id;

    if (!authUserId) return res.json({ msg: "No user found" });

    const updatedGroup = await prisma.group.update({
        data: {
            members: newMembers
        },
        where: {
            id: parseInt(groupId)          
        }
    })
    res.json(updatedGroup);

    io.emit("restartGroupChats", { msg: "Refreshing..." });
}

// THESE TWO WORK THE SAME WAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY

exports.updateGroupMembers = async (req, res) => {
    const { groupId } = req.params;
    const { newMembers } = req.body;
    const authUserId = req.user.id;

    if (!authUserId) return res.json({ msg: "No user found" });

    const updatedGroup = await prisma.group.update({
        data: {
            members: newMembers
        },
        where: {
            id: parseInt(groupId)          
        }
    })
    res.json(updatedGroup);

    io.emit("restartGroupChats", { msg: "Refreshing..." });
}

exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
        where: { id: parseInt(groupId) }
    })

    if (!group) return res.json({ msg: "No group found" });

    await prisma.groupMessage.deleteMany({
        where: { groupId: parseInt(groupId) }
    })

    const delGroup = await prisma.group.delete({
        where: { id: parseInt(groupId) }
    })
    res.json(delGroup);

    io.emit("restartGroupChats", { msg: "Refreshing..." });
}
import prisma from "../db/prismaClient.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";

createGroup = async (req, res) => {
    try {
        const { groupName, membersId, groupImg } = req.body;
    
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
        res.status(200).json(newGroup);
    } catch (error) {
        console.log("Error in createGroup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

getAllGroups = async (req, res) => {
    try {
        const allGroups = await prisma.group.findMany({
            orderBy: { updatedAt: "desc" }
        })
        res.status(200).json(allGroups);
    } catch (error) {
        console.log("Error in getAllGroups controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

updateGroupImage = async (req, res) => {
    try {
        const { groupImg } = req.body;
        const { groupId } = req.params;
    
        if (!groupImg) return res.json({ msg: "No group image is given" });
    
        const uploadResponse = await cloudinary.uploader.upload(groupImg);
    
        const updatedGroup = await prisma.group.update({
            data: {
                groupImg: uploadResponse.secure_url
            },
            where: { id: parseInt(groupId) }
        })
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.log("Error in updateGroupImage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

updateGroupName = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { newName } = req.body;
    
        const updatedGroup = await prisma.group.update({
            data: {
                name: newName
            },
            where: {
                id: parseInt(groupId)          
            }
        })
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.log("Error in updateGroupName controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

removeMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { newMembers } = req.body;
    
        const updatedGroup = await prisma.group.update({
            data: {
                members: newMembers
            },
            where: {
                id: parseInt(groupId)          
            }
        })
        res.status(200).json(updatedGroup);
    
        io.emit("restartGroupChats", { message: "Refreshing..." });
    } catch (error) {
        console.log("Error in removeMember controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// THESE TWO WORK THE SAME WAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY

updateGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { newMembers } = req.body;
    
        const updatedGroup = await prisma.group.update({
            data: {
                members: newMembers
            },
            where: {
                id: parseInt(groupId)          
            }
        })
        res.status(200).json(updatedGroup);
    
        io.emit("restartGroupChats", { message: "Refreshing..." });
    } catch (error) {
        console.log("Error in updateGroupMembers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

deleteGroup = async (req, res) => {
    try {
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
        res.status(200).json(delGroup);

        io.emit("restartGroupChats", { message: "Refreshing..." });
    } catch (error) {
        console.log("Error in deleteGroup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    createGroup,
    getAllGroups,
    updateGroupImage,
    updateGroupName,
    removeMember,
    updateGroupMembers,
    deleteGroup
}
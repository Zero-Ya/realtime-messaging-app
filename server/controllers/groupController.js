const prisma = require("../db/prismaClient");
const cloudinary = require("../lib/cloudinary");

exports.createGroup = async (req, res) => {
    const { groupName, membersId } = req.body;

    if (!req.user) return res.json({ msg: "No user found" })

    const ifGroup = await prisma.group.findFirst({
        where: {
            members: {
                hasEvery: membersId
            }
        }
    })

    if (ifGroup) return res.json({ msg: "Group already exists" })

    const newGroup = await prisma.group.create({
        data: {
            name: groupName,
            adminId: req.user.id,
            members: membersId
        }
    })
    res.json(newGroup)
}

exports.getAllGroups = async (req, res) => {
    const allGroups = await prisma.group.findMany()
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
            where: { id: groupId }
        })
        res.json(updatedGroup)
    } else res.json({ msg: "No user found" })
}
const prisma = require("../db/prismaClient");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const passport = require("passport");
const cloudinary = require("../lib/cloudinary");

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

const validateUser = [
    body("username").trim().escape()
        .isAlpha().withMessage(`Username ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`Username ${lengthErr}`),
    body("password").trim().escape()
        .isLength({ min: 9, max: 30 }).withMessage("Password must be between 9 and 30 characters")
]

exports.logUserIn = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ errMsg: "Incorrect username or password" })
        req.logIn(user, (err) => {
            if (err) return next(err)
            res.json(user)
        })
    })(req, res, next)
}

exports.register = [
    validateUser,
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, password } = req.body

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
            try {
                const user = await prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword
                    }
                })
                res.json(user)
            } catch(err) {
                return next(err)
            }
        })
    }
]

exports.logOut = async (req, res) => {
    req.logout(() => res.end())
}

exports.getAuthUser = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in getAuthUser controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// exports.getUser = async (req, res) => {
//     const { userId } = req.params
//     const theUser = await prisma.user.findUnique({
//         where: { id: parseInt(userId) }
//     })
//     res.json(theUser);
// }

exports.getAllUsers = async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
}

exports.updateProfile = async (req ,res) => {
    const { profileImg } = req.body;
    const authUserId = req.user.id;

    if (!profileImg) return res.json({ msg: "No profile image is given" })
    
    const uploadResponse = await cloudinary.uploader.upload(profileImg);

    if (authUserId) {
        const updatedUser = await prisma.user.update({
            data: {
                profileImg: uploadResponse.secure_url
            },
            where: { id: authUserId }
        })
        res.json(updatedUser)
    } else res.json({ msg: "No user found" })
}
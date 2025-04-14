import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import passport from "passport";
import cloudinary from "../lib/cloudinary.js";

import { body, validationResult } from "express-validator";

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 20 characters.";

const validateUser = [
    body("username").trim().escape()
        .isAlpha().withMessage(`Username ${alphaErr}`)
        .isLength({ min: 1, max: 20 }).withMessage(`Username ${lengthErr}`),
    body("password").trim().escape()
        .isLength({ min: 9, max: 30 }).withMessage("Password must be between 9 and 30 characters")
]

logUserIn = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ errMsg: "Incorrect username or password" });
        req.logIn(user, (err) => {
            if (err) return next(err);
            generateToken(user.id, res);
            res.status(200).json(user);
        })

    })(req, res, next)
}

register = [
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
                if (user) {
                    res.status(201).json(user);
                } else {
                    res.status(401).json({ message: "Invalid user data" });
                }
            } catch(err) {
                console.log("Error in register controller", err.message);
                return next(err);
            }
        })
    }
]

logOut = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        req.logout(() => res.end());
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

getAuthUser = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in getAuthUser controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

getAllUsers = async (req, res) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers)
    } catch (error) {
        console.log("Error in getAllUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

updateProfile = async (req ,res) => {
    try {
        const { profileImg } = req.body;
        const authUserId = req.user.id;
    
        if (!profileImg) return res.status(400).json({ message: "Profile image is required" });
        
        const uploadResponse = await cloudinary.uploader.upload(profileImg);
        const updatedUser = await prisma.user.update({
            data: {
                profileImg: uploadResponse.secure_url
            },
            where: { id: authUserId }
        })
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    logUserIn,
    register,
    logOut,
    getAuthUser,
    getAllUsers,
    updateProfile
}
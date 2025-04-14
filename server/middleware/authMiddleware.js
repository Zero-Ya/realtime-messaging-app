import jwt from "jsonwebtoken";
import prisma from "../db/prismaClient.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) return res.status(401).json({ message: "Unauthorized - No Token Provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid Token" });

        const user = await prisma.user.findUnique({ 
            where: { id: decoded.userId },
            omit: { password: true }
         })

         if (!user) return res.status(404).json({ message: "User not found" });

         req.user = user;
        next()
    } catch (err) {
        console.log("Error in protectRoute middleware", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default protectRoute;
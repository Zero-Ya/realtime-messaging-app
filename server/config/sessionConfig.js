import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import expressSession from "express-session";
import prisma from "../db/prismaClient.js";

const sessionConfig = expressSession({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    })
})

export default sessionConfig;
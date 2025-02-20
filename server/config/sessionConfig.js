const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const expressSession = require("express-session");
const prisma = require("../db/prismaClient");

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

module.exports = sessionConfig;
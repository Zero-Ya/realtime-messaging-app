import passport from "passport";
import LocalStrategy from ("passport-local").Strategy;
import prisma from "../db/prismaClient.js";
import bcrypt from "bcryptjs";

const localStrategy = new LocalStrategy(async (username, password, done) => {
    try {
        const user = await prisma.user.findFirst({ where: { username } })
        if (!user) {
            return done(null, false, { message: 'Username not found' })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return done(null, false, { message: 'Incorrect password' })
        }
        return done(null, user)
    } catch (err) {
        return done(err)
    }
})

passport.use(localStrategy);

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id }})
        done(null, user)
    } catch (err) {
        done(err)
    }
})
const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
    console.log(userId, res)
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    console.log(process.env.JWT_SECRET)

    console.log("First token:",token)

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV !== "development",
    })

    console.log("Second token:", token)

    return token;
}

module.exports = generateToken;
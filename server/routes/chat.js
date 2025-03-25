const { Router } = require("express");
const chatController = require("../controllers/chatController");
const protectRoute = require("../middleware/authMiddleware.js");

const router = Router();

router.post("/", protectRoute, chatController.createChat);
router.post("/remove", protectRoute, chatController.removeChat);
router.get("/users/:userId", protectRoute, chatController.getUserChatList);
router.get("/all", protectRoute, chatController.getAllChats);
router.get("/chat/:authUserId/:selectedUserId", protectRoute, chatController.getChat);

module.exports = router;
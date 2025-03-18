const { Router } = require("express");
const router = Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.createChat);
router.post("/remove", chatController.removeChat);
router.get("/users/:userId", chatController.getUserChatList);
router.get("/all", chatController.getAllChats);
router.get("/chat/:authUserId/:selectedUserId", chatController.getChat);

module.exports = router;
const { Router } = require("express");
const router = Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.createChat);
router.get("/users/:userId", chatController.getUserChat);
router.get("/all", chatController.getAllChats);
router.get("/chat/:authUserId/:selectedUserId", chatController.getChat);

module.exports = router;
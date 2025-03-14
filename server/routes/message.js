const { Router } = require("express");
const router = Router();
const messageController = require("../controllers/messageController");

router.post("/chats/:chatId/:receiverId", messageController.postMessage);
router.post("/groups/:groupId", messageController.postGroupMessage);
router.get("/chats/:userId", messageController.getChatMessages);
router.get("/groups/:groupId", messageController.getGroupMessages);


module.exports = router;
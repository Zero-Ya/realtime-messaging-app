const { Router } = require("express");
const router = Router();
const messageController = require("../controllers/messageController");

router.post("/:chatId/:receiverId", messageController.postMessage);
router.get("/chats/:userId", messageController.getChatMessages);


module.exports = router;
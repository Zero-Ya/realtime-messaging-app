const { Router } = require("express");
const router = Router();
const messageController = require("../controllers/messageController");

const upload = require("../lib/multer")

router.post("/chats/:chatId/:receiverId", upload.single("file"), messageController.postMessage);
router.post("/groups/:groupId", upload.single("file"), messageController.postGroupMessage);
router.get("/chats/:userId", messageController.getChatMessages);
router.get("/groups/:groupId", messageController.getGroupMessages);

module.exports = router;
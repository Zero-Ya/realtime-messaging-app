const { Router } = require("express");
const messageController = require("../controllers/messageController");
const protectRoute = require("../middleware/authMiddleware.js");

const router = Router();

const upload = require("../lib/multer")

router.post("/chats/:chatId/:receiverId", protectRoute, upload.single("file"), messageController.postMessage);
router.post("/groups/:groupId", protectRoute, upload.single("file"), messageController.postGroupMessage);
router.get("/chats/:userId",protectRoute, messageController.getChatMessages);
router.get("/groups/:groupId",protectRoute, messageController.getGroupMessages);

module.exports = router;
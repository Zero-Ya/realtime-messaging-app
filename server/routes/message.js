import { Router } from "express";
import messageController from "../controllers/messageController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

import upload from "../lib/multer.js";

router.post("/chats/:chatId/:receiverId", protectRoute, upload.single("file"), messageController.postMessage);
router.post("/groups/:groupId", protectRoute, upload.single("file"), messageController.postGroupMessage);
router.get("/chats/:userId",protectRoute, messageController.getChatMessages);
router.get("/groups/:groupId",protectRoute, messageController.getGroupMessages);

export default router;
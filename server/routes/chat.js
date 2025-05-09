import { Router } from "express";
import * as chatController from "../controllers/chatController.js";
import protectRoute from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protectRoute, chatController.createChat);
router.delete("/", protectRoute, chatController.removeChat);
router.get("/users/:userId", protectRoute, chatController.getUserChatList);
router.get("/", protectRoute, chatController.getAllChats);
router.get("/chat/:authUserId/:selectedUserId", protectRoute, chatController.getChat);

export default router;
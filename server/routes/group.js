const { Router } = require("express");
const groupController = require("../controllers/groupController");
const protectRoute = require("../middleware/authMiddleware.js");

const router = Router();

router.get("/", protectRoute, groupController.getAllGroups);
router.post("/", protectRoute, groupController.createGroup);
router.put("/update-image/:groupId", protectRoute, groupController.updateGroupImage);
router.put("/update-name/:groupId", protectRoute, groupController.updateGroupName);
router.put("/remove-member/:groupId", protectRoute, groupController.removeMember);
router.put("/update-members/:groupId", protectRoute, groupController.updateGroupMembers);
router.delete("/:groupId", protectRoute, groupController.deleteGroup);

module.exports = router;
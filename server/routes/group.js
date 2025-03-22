const { Router } = require("express");
const router = Router();
const groupController = require("../controllers/groupController");

router.get("/all", groupController.getAllGroups);
router.post("/", groupController.createGroup);
router.put("/update-image/:groupId", groupController.updateGroupImage);
router.put("/update-name/:groupId", groupController.updateGroupName);
router.put("/remove-member/:groupId", groupController.removeMember);
router.put("/update-members/:groupId", groupController.updateGroupMembers);
router.post("/delete/:groupId", groupController.deleteGroup);

module.exports = router;
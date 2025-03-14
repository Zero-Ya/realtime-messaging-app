const { Router } = require("express");
const router = Router();
const groupController = require("../controllers/groupController");

router.get("/all", groupController.getAllGroups);
router.post("/", groupController.createGroup);
router.put("/update-image/:groupId", groupController.updateGroupImage);

module.exports = router;
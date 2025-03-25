const { Router } = require("express");
const indexController = require("../controllers/indexController");
const protectRoute = require("../middleware/authMiddleware.js");

const router = Router();

router.post("/register", indexController.register);
router.get("/logout", indexController.logOut);
router.post("/login", indexController.logUserIn);
router.put("/update-profile", protectRoute, indexController.updateProfile);
router.get("/authUser", protectRoute, indexController.getAuthUser);
router.get("/all-users", protectRoute, indexController.getAllUsers);

module.exports = router;
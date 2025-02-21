const { Router } = require("express");
const router = Router();
const indexController = require("../controllers/indexController");

router.post("/register", indexController.register);
router.get("/logout", indexController.logOut);
router.post("/login", indexController.logUserIn);
router.get("/authUser", indexController.getAuthUser)

module.exports = router;
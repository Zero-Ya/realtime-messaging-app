const { Router } = require("express");
const router = Router();
const indexController = require("../controllers/indexController");

router.post("/signup", indexController.register);
router.get("/logout", indexController.logOut);
router.post("/login", indexController.logUserIn);

module.exports = router;
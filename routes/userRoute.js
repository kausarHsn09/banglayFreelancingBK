const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();


router.get("/",authController.protectRoute,authController.restrictToAdmin, userController.allUser);
router.post('/',authController.protectRoute,authController.restrictToAdmin,userController.createUser);
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin,userController.deleteUser);


router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;

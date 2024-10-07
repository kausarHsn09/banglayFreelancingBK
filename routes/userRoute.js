const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = express.Router();


router.get("/",authController.protectRoute,authController.restrictToAdmin, userController.allUser);
router.get('/my-referrals/count', authController.protectRoute, userController.countMyReferralUses);
router.get('/myinfo', authController.protectRoute, userController.getUserInfo);
router.get('/find-user',authController.protectRoute,authController.restrictToAdmin, userController.findUser);
router.post('/',authController.protectRoute,authController.restrictToAdmin,userController.createUser);
router.post('/edit-user',authController.protectRoute,authController.restrictToAdmin,userController.editUser)
router.delete('/:id',authController.protectRoute,authController.restrictToAdmin,userController.deleteUser);


router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;

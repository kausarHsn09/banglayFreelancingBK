// routes/hashtagRoutes.js
const express = require("express");
const router = express.Router();
const hashtagController = require("../controllers/hashtagController");
const authController = require("../controllers/authController");

router.get("/", authController.protectRoute, hashtagController.getAllHashtags);
router.get(
  "/category/:categoryId",
  authController.protectRoute,
  hashtagController.getHashtagsByCategory
);
router.post(
  "/",
  authController.protectRoute,
  authController.restrictToAdmin,
  hashtagController.createHashtag
);
router.delete(
  "/:id",
  authController.protectRoute,
  authController.restrictToAdmin,
  hashtagController.deleteHashtag
);
module.exports = router;

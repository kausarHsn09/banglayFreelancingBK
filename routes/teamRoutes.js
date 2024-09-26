const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { protectRoute } = require("../controllers/authController");

// Create a new team
router.route("/create").post(protectRoute, teamController.createTeam);

// Join a team
router.route("/join").post(protectRoute, teamController.joinTeam);

router.route("/my-teams").get(protectRoute, teamController.getMyTeams);
// Get teams with pagination, filtering by area, and sorting by member size
router.route("/").get(protectRoute, teamController.getTeams);
router.get("/joined-teams", protectRoute, teamController.getJoinedTeams);
// Get a single team by ID
router.route("/:teamId").get(protectRoute, teamController.getTeamById);


// Update a team (only the creator can update)
router.route("/update/:teamId").patch(protectRoute, teamController.updateTeam);

// Delete a team (only the creator can delete)
router.route("/delete/:teamId").delete(protectRoute, teamController.deleteTeam);

module.exports = router;

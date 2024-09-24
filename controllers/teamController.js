const Team = require("../models/teamModel");
const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateCreateTeam = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required.")
    .custom((value) => {
      const words = value.split(" ").filter(Boolean);
      if (words.length > 10) {
        throw new Error("10 শব্দের মধ্যে নাম লিখুন.");
      }
      return true;
    }),
  body("contactNumber")
    .trim()
    .isLength({ min: 11, max: 11 })
    .withMessage("১১ সংখ্যার সঠিক ফোন নাম্বার লিখুন"),
  body("telegramLink")
    .isURL()
    .withMessage("Please provide a valid URL for the video link."),
];

exports.createTeam = [
  validateCreateTeam,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, teamArea, telegramLink, contactNumber,code } = req.body;
      const creator = req.userId;

      const team = await Team.create({
        name,
        creator,
        teamArea,
        telegramLink,
        contactNumber,
        code,
        members: [creator],
      });

      res.status(201).json({
        status: "success",
        data: team,
      });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  },
];

exports.joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const userId = req.userId;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this team." });
    }

    team.members.push(userId);
    team.level = team.calculateLevel();
    await team.save();

    res.status(200).json({ status: "success", data: team });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Fetch a single team by ID
exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { page = 1, limit = 20 } = req.query; // Default to page 1, limit 20 members per page

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch the team without members first
    const team = await Team.findById(teamId).populate({
      path: "creator",
      select: "name phone",
    }); // Only select name and phone for creator

    if (!team) {
      return res
        .status(404)
        .json({ status: "error", message: "Team not found" });
    }

    // Fetch members with pagination, selecting only name and phone fields
    const members = await Team.findById(teamId)
      .select("members")
      .populate({
        path: "members",
        select: "name phone", // Only select name and phone for members
        options: {
          skip: skip,
          limit: parseInt(limit),
        },
      });

    res.status(200).json({
      status: "success",
      data: {
        ...team._doc,
        members: members.members, // Include only paginated members with selected fields
        membersCount: members.members.length,
        totalMembers: team.members.length, // Total number of members for pagination
        page: parseInt(page),
        totalPages: Math.ceil(team.members.length / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.getMyTeams = async (req, res) => {
  try {
    const userId = req.userId; // Assuming `userId` is set from authentication middleware

    // Find teams where the current user is the creator, without populating members and creator
    const teams = await Team.find({ creator: userId }).select(
      "name teamArea telegramLink contactNumber level"
    );

    if (!teams || teams.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No teams found for this user" });
    }

    res.status(200).json({
      status: "success",
      data: teams,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const { area, page = 1, limit = 10 } = req.query; // Default to page 1, limit 10 results per page

    // Filtering by area if provided
    let filter = {};
    if (area) {
      filter.teamArea = area;
    }

    // Calculate pagination parameters
    const skip = (page - 1) * limit;

    // Find teams with optional area filter, pagination, and sorting by members count (descending)
    const teams = await Team.find(filter)
      .populate({ path: "creator", select: "name phone" }) // Only populate name and phone of creator
      .sort({ members: -1 }) // Sort by member size (descending)
      .skip(skip)
      .limit(parseInt(limit));

    // Map teams to include the member count instead of the full members array
    const teamsWithMemberCount = teams.map((team) => ({
      ...team._doc,
      membersCount: team.members.length, // Return the count of members
      members: undefined, // Don't return members array
    }));

    // Get total count of teams for the current filter
    const totalTeams = await Team.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: {
        total: totalTeams,
        page: parseInt(page),
        totalPages: Math.ceil(totalTeams / limit),
        teams: teamsWithMemberCount,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;

    const team = await Team.findOne({ _id: teamId, creator: userId });

    if (!team) {
      return res.status(404).json({
        message:
          "Team not found or you do not have permission to delete this team.",
      });
    }

    await Team.findByIdAndDelete(teamId);
    res
      .status(204)
      .json({ status: "success", message: "Team deleted successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const { teamId } = req.params;

    let team = await Team.findOne({ _id: teamId, creator: userId });

    if (!team) {
      return res.status(404).json({
        message:
          "Team not found or you do not have permission to update this team.",
      });
    }

    // Update fields
    team.teamArea = req.body.teamArea || team.teamArea;
    team.telegramLink = req.body.telegramLink || team.telegramLink;
    team.contactNumber = req.body.contactNumber || team.contactNumber;

    await team.save();
    res.status(200).json({ status: "success", data: team });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

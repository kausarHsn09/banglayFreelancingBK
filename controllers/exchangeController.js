const Exchange = require("../models/exchangeModel");
const { body, validationResult } = require("express-validator");

// Validation middleware for creating an exchange
const validateExchangePost = [
  body("post")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Post cannot be empty.")
    .custom((value) => {
      const words = value.match(/\S+/g) || []; // This matches non-space character groups
      if (words.length > 30) {
        throw new Error("Post must not exceed 30 words.");
      }
      return true;
    }),
  body("targetLink")
    .isURL()
    .withMessage("Please provide a valid URL for the video link."),
];

exports.createExchange = async (req, res) => {
  try {
    const { type, targetLink,post} = req.body;
     const userId = req.userId;
    const newExchange = await Exchange.create({
      type,
      targetLink,
      post,
      creatorId: userId
    });
    res.status(201).send(newExchange);
  } catch (error) {
    res.status(500).send({ message: 'Error creating exchange', error: error.message });
  }
};

exports.getExchangeFeed = async (req, res) => {
  try {
    const userId = req.userId; // Make sure this is correctly set by your authentication middleware
    const { type, page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) {
      query.type = type; // Apply type filter if specified
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sorting by creation date
      select: '-__v', // Exclude the version key
      populate: {
        path: 'creatorId',
        select: 'name' // Assuming you want to populate the creator's name
      }
    };

    const result = await Exchange.paginate(query, options);

    // Mapping through documents to add the accepted count and participation flag
   const exchangesWithCounts = result.docs.map(doc => {
  const exchange = doc.toObject({ getters: true, virtuals: false });
  exchange.acceptedCount = exchange.acceptedExchanges.length; // Only count is sent
  exchange.hasUserParticipated = exchange.acceptedExchanges.some(e => e.user=== userId); // Correct comparison
  delete exchange.acceptedExchanges; // Remove detailed data
  return exchange;
});

    // Sending the modified documents along with original pagination data
    res.status(200).json({
      ...result,
      docs: exchangesWithCounts // Replace original docs with modified ones
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching the exchange feed', error: error.message });
  }
};


exports.getMyExchanges = async (req, res) => {
  try {
    const userId = req.userId; // This should be set from your authentication middleware
    const { page = 1, limit = 10 } = req.query; // Handling pagination parameters

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 }, // Sorting by creation date
      select: '-__v', // Exclude the version key
      populate: {
        path: 'creatorId',
        select: 'name' // Assuming you want to populate the creator's name
      } 
    };

    // Use paginate method provided by mongoose-paginate
    const result = await Exchange.paginate({ creatorId: userId }, options);

    // Mapping through documents to add the accepted count and participation check
  // Both functions will follow a similar pattern:
const exchangesWithCounts = result.docs.map(doc => {
  const exchange = doc.toObject({ getters: true, virtuals: false });
  exchange.acceptedCount = exchange.acceptedExchanges.length; // Only count is sent
  exchange.hasUserParticipated = exchange.acceptedExchanges.some(e => e.user=== userId); // Correct comparison
  delete exchange.acceptedExchanges; // Remove detailed data
  return exchange;
});

    // Sending the modified documents along with original pagination data
    res.status(200).json({
      ...result,
      docs: exchangesWithCounts // Replace original docs with modified ones
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching your exchanges', error: error.message });
  }
};


exports.acceptExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params;
    const userId = req.userId; // Assuming this is set from your authentication middleware
    const { link } = req.body;

    // Fetch the exchange to check conditions
    const exchange = await Exchange.findById(exchangeId);

    // Check if the user is trying to accept their own post
    // if (exchange.creatorId === userId) {
    //   return res.status(403).json({ message: "You cannot accept your own exchange post." });
    // }

    // Check if the user has already accepted this exchange
    if (exchange.acceptedExchanges.some(e => e.user === userId)) {
      return res.status(409).json({ message: "You have already accepted this exchange." });
    }

    // Proceed to accept the exchange
    const updatedExchange = await Exchange.findByIdAndUpdate(
      exchangeId,
      { $push: { acceptedExchanges: { user: userId, link } } },
      { new: true }
    );

    // Count the total accepted exchanges for this post
    const totalAccepted = updatedExchange.acceptedExchanges.length;

    res.status(200).json({ exchange: updatedExchange, totalAccepted });
  } catch (error) {
    res.status(500).send({ message: 'Error accepting exchange', error: error.message });
  }
};

exports.getAcceptedExchanges = async (req, res) => {
  try {
    const { exchangeId } = req.params; // Get exchange ID from URL parameters
    const { page = 1, limit = 10 } = req.query; // Pagination parameters

    // Convert page and limit to integer, with defaults
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const exchange = await Exchange.findById(exchangeId).select('acceptedExchanges');
    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found." });
    }

    // Manually paginate the acceptedExchanges array
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedItems = exchange.acceptedExchanges.slice(startIndex, endIndex);

    // Construct pagination metadata
    const totalAccepted = exchange.acceptedExchanges.length;
    const totalPages = Math.ceil(totalAccepted / limitNum);

    res.status(200).json({
      totalItems: totalAccepted,
      totalPages: totalPages,
      currentPage: pageNum,
      acceptedExchanges: paginatedItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accepted exchanges', error: error.message });
  }
};

exports.deleteExchange = async (req, res) => {
  try {
    const { exchangeId } = req.params; // ID of the exchange to delete
    const userId = req.userId; // Assuming this is set from your authentication middleware

    // First, find the exchange to ensure it exists and to check if the current user is the creator
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found." });
    }

    // Check if the current user is the creator of the exchange
    if (!exchange.creatorId ===userId) {
      return res.status(403).json({ message: "You are not authorized to delete this exchange." });
    }

    // Delete the exchange if the above checks pass
    await Exchange.findByIdAndDelete(exchangeId);

    res.status(200).json({ message: "Exchange successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exchange', error: error.message });
  }
};
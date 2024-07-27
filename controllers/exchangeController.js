const Exchange = require('../models/exchangeModel')


//ddd
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
      exchange.acceptedCount = exchange.acceptedExchanges.length;
      exchange.hasUserParticipated = exchange.acceptedExchanges.some(e => e.user === userId);
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
    const userId = req.userId;
    const exchanges = await Exchange.find({ creatorId: userId }).select('-__v').populate('creatorId', 'name');

    // Adding count of accepted exchanges to each entry
    const exchangesWithCounts = exchanges.map(exchange => ({
      ...exchange.toObject(),
      acceptedCount: exchange.acceptedExchanges.length
    }));

    res.status(200).json(exchangesWithCounts);
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

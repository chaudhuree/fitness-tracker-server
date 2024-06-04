const { StatusCodes } = require("http-status-codes");
const NewsLetter = require("../models/NewsLetter");

// add subscriber
const addSubscriber = async (req, res) => {
  const { email, name } = req.body;
  try {
    let subscriber = await NewsLetter.findOne({ email });
    if (subscriber) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Subscriber already exists" });
    } else {
      subscriber = await NewsLetter.create({ email, name });
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, message: "Subscriber added" });
    }
  }
  catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
}

// send updates to subscribers
// TODO: send updates to subscribers


module.exports = { addSubscriber };
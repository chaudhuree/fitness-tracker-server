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
const sendUpdates = async (req, res) => {
  const { message } = req.body;
  try{
    // get all subscribers
    const subscribers = await NewsLetter.find();
    // send updates to subscribers
    subscribers.forEach(subscriber => {
      // send an email to each subscriber
      console.log('Sending email to: ', subscriber.email, ' with updates');
    });
    // for each subscriber, send an email with the updates
    // use nodemailer to send emails
  }
  catch(error){
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
}


module.exports = { addSubscriber, sendUpdates };
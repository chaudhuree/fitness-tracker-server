const express = require("express");

const router = express.Router();

    let total;
const { addSubscriber,sendUpdates,getSubscribers,getSubscribersCount } = require("../controllers/newsLetterController.js");

router.get("/newsletter/subscribers", getSubscribers);
router.post("/newsletter/subscribe", addSubscriber);
router.post("/newsletter/send", sendUpdates);
router.get("/newsletter/total", getSubscribersCount);

module.exports = router;
const express = require("express");

const router = express.Router();

const { addSubscriber,sendUpdates } = require("../controllers/newsLetterController.js");

router.post("/newsletter/subscribe", addSubscriber);
router.post("/newsletter/send", sendUpdates);

module.exports = router;
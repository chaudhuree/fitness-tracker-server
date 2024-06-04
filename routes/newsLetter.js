const express = require("express");

const router = express.Router();

const { addSubscriber } = require("../controllers/newsLetterController.js");

router.post("/newsletter/subscribe", addSubscriber);

module.exports = router;
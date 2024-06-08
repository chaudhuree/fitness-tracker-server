const express = require("express");

const router = express.Router();

const {
  addReview,
    getAllReviews,
    getAllReviewsByTrainerId
} = require("../controllers/reviewController");

router.post("/review/add", addReview);
router.get("/review/all", getAllReviews);
router.get("/review/trainer/:trainerId", getAllReviewsByTrainerId);

module.exports = router;
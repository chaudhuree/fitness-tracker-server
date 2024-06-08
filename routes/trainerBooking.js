const express = require("express");

const router = express.Router();

const {
  addTrainerBooking,
  getAllTrainerBookings,
  getAllUserBookings,
  getTrainerBookingByDate,
} = require("../controllers/trainerBookingController");

router.post("/trainerbooking/add", addTrainerBooking);
router.get("/trainerbooking/all", getAllTrainerBookings);
// url: http://localhost:5000/api/v1/trainerbooking/all?trainerId=60e5f4b5c3e9d3b3f0f3b3b3?page=1&limit=10
router.get("/trainerbooking/usersbookings", getAllUserBookings);
// url: http://localhost:5000/api/v1/trainerbooking/usersbookings?userName=John?page=1&limit=10
router.get("/trainerbooking/trainers", getTrainerBookingByDate);
// url: http://localhost:5000/api/v1/trainerbooking/trainers?date=2021-07-08?page=1&limit=10

module.exports = router;

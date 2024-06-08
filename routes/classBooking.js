const express = require("express");

const router = express.Router();

const {
  addClassBooking,
  getAllClassBookings,
  getAllClassBookingsByClassId,
  getAllBookingsByUser,
  totalEarnings,
} = require("../controllers/classBookingController.js");

router.post("/classbooking/add", addClassBooking);
router.get("/classbooking/all", getAllClassBookings);
router.get("/classbooking/user/:userId", getAllBookingsByUser);
router.get("/classbooking/totalprice", totalEarnings);
router.get("/classbooking/class/:classId", getAllClassBookingsByClassId);

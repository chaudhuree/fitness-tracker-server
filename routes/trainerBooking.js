const express = require("express");

const router = express.Router();

const {
  addTrainerBooking,
  getAllTrainerBookings,
  getAllUserBookings,
  getAllBookingsByUser,
  getTrainerBookingBySlotTime,
  updateCourseStatus,
  updatePaymentStatus,
  getTrainerBookingById,
  totalPriceCalculation,
  totalPriceCalculationForTrainer,
  totalPriceCalculationByClass,
  totalPriceCalculationByClasses
} = require("../controllers/trainerBookingController");


router.post("/trainerbooking/add", addTrainerBooking);
router.get("/trainerbooking/all", getAllTrainerBookings);
router.get("/trainerbooking/user/all", getAllUserBookings);
router.get("/trainerbooking/user", getAllBookingsByUser);
router.get("/trainerbooking/slottime", getTrainerBookingBySlotTime);
// total earning by all trainers
router.get("/trainerbooking/totalprice", totalPriceCalculation);
// total earning by individual classes
router.get("/trainerbooking/totalprice/classes", totalPriceCalculationByClasses);
// total earning by a trainer
router.get("/trainerbooking/totalprice/trainer/:id", totalPriceCalculationForTrainer);
router.put("/trainerbooking/update/:id", updateCourseStatus);
router.put("/trainerbooking/payment/update/:id", updatePaymentStatus);
router.get("/trainerbooking/trainer/:id", getTrainerBookingById);
// total earning by a class
router.get("/trainerbooking/totalprice/class/:id", totalPriceCalculationByClass);



module.exports = router;

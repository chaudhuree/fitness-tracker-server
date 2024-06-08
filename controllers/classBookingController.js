const { StatusCodes } = require("http-status-codes");
const ClassBooking = require("../models/ClassBooking");
const Class = require("../models/Class");

// add a new class booking
const addClassBooking = async (req, res) => {
  try {
    const classBookingInstance = await ClassBooking.create(req.body);
    const classInstance = await Class.findByIdAndUpdate(
      req.body.class,
      { $inc: { bookingCount: 1 } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: classBookingInstance,
      message: "Class booking added successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all class bookings with pagination and sorting
// for admin
const getAllClassBookings = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const classBookings = await ClassBooking.find()
      .populate("user")
      .populate("class")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await ClassBooking.countDocuments();
    res.status(StatusCodes.OK).json({
      success: true,
      data: { classBookings, total: count },
      message: "Class bookings retrieved successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all class bookings with pagination and sorting using class id
// for admin
const getAllClassBookingsByClassId = async (req, res) => {
  const { classId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    if (classId) {
      const classBookings = await ClassBooking.find({ class: classId })
        .populate("user")
        .populate("class")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const count = await ClassBooking.countDocuments({ class: classId });
      res.status(StatusCodes.OK).json({
        success: true,
        data: { classBookings, total: count },
        message: "Class bookings retrieved successfully",
      });
    }

    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Class id is required" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all class bookings with pagination and sorting using user id
// for logged in user
const getAllBookingsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (userId) {
      const userBookings = await ClassBooking.find({ user: userId })
        .populate("user")
        .populate("class")
        .sort({ createdAt: -1 });

      res.status(StatusCodes.OK).json({
        success: true,
        data: { userBookings },
        message: "User bookings retrieved successfully",
      });
    }

    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "User id is required" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// total price calculation for all bookings based on paymentStatus=approved
// for admin
const totalEarnings = async (req, res) => {
  try {
    const totalEarnings = await ClassBooking.aggregate([
      {
        $match: { paymentStatus: "approved" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: totalEarnings,
      message: "Total earnings calculated successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  addClassBooking,
  getAllClassBookings,
  getAllClassBookingsByClassId,
  getAllBookingsByUser,
  totalEarnings,
};
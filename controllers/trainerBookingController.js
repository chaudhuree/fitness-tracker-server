const { StatusCodes } = require("http-status-codes");
const TrainerBooking = require("../models/TrainerBooking");
const User = require("../models/User");

// add a new trainer booking
const addTrainerBooking = async (req, res) => {
  try {
    const trainerBookingInstance = await TrainerBooking.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: trainerBookingInstance,
      message: "Trainer booking added successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all trainer bookings with pagination and sorting and filtering using trainer id
// for admin
const getAllTrainerBookings = async (req, res) => {
  const { page = 1, limit = 10, trainerId } = req.query;
  try {
    if (trainerId) {
      const trainerBookings = await TrainerBooking.find({ trainer: trainerId })
        .populate("user")
        .populate("trainer")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const count = await TrainerBooking.countDocuments({ trainer: trainerId });
      res.status(StatusCodes.OK).json({
        success: true,
        data: { trainerBookings, total: count },
        message: "Trainer bookings retrieved successfully",
      });
    } else {
      const trainerBookings = await TrainerBooking.find()
        .populate("user")
        .populate("trainer")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const count = await TrainerBooking.countDocuments();
      res.status(StatusCodes.OK).json({
        success: true,
        data: { trainerBookings, total: count },
        message: "Trainer bookings retrieved successfully",
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all  bookings with pagination and sorting and filtering using user email
// for admin
const getAllUserBookings = async (req, res) => {
  const { page = 1, limit = 10, userEmail } = req.query;
  try {
    const userId = await User.findOne({
      email: userEmail,
    }).select("_id");
    if (userId) {
      const userBookings = await TrainerBooking.find({ user: userId })
        .populate("user")
        .populate("trainer")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const count = await TrainerBooking.countDocuments({ user: userId });
      res.status(StatusCodes.OK).json({
        success: true,
        data: { userBookings, total: count },
        message: "User bookings retrieved successfully",
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
// get all trainer bookings with pagination and sorting and filtering using user id
// for logged in user
const getAllBookingsByUser = async (req, res) => {
  const { page = 1, limit = 10, userId } = req.query;
  try {
    if (userId) {
      const userBookings = await TrainerBooking.find({ user: userId })
        .populate("user")
        .populate("trainer")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      const count = await TrainerBooking.countDocuments({ user: userId });
      res.status(StatusCodes.OK).json({
        success: true,
        data: { userBookings, total: count },
        message: "User bookings retrieved successfully",
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all data of using trainer id
// for trainer
const getTrainerBookingById = async (req, res) => {
  const { trainerId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const trainerBookings = await TrainerBooking.find({ trainer: trainerId })
      .populate("user")
      .populate("trainer")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await TrainerBooking.countDocuments({ trainer: trainerId });
    res.status(StatusCodes.OK).json({
      success: true,
      data: { trainerBookings, total: count },
      message: "Trainer bookings retrieved successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};


// get all data of using trainer and and slot time
// for trainer
const getTrainerBookingBySlotTime = async (req, res) => {
  const { trainerId, scheduleTime, courseStatus } = req.query;
  try {
    if (scheduleTime) {
      if (courseStatus) {
        const trainerBookings = await TrainerBooking.find({
          trainer: trainerId,
          "slotTime.scheduleTime": scheduleTime,
          courseStatus: courseStatus,
        })
          .populate("user")
          .populate("trainer")
          .sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({
          success: true,
          data: trainerBookings,
          message: "Trainer bookings retrieved successfully",
        });
      } else {
        const trainerBookings = await TrainerBooking.find({
          trainer: trainerId,
          "slotTime.scheduleTime": scheduleTime,
        })
          .populate("user")
          .populate("trainer")
          .sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({
          success: true,
          data: trainerBookings,
          message: "Trainer bookings retrieved successfully",
        });
      }
    } else {
      const trainerBookings = await TrainerBooking.find({
        trainer: trainerId,
        date,
      });
      res.status(StatusCodes.OK).json({
        success: true,
        data: trainerBookings,
        message: "Trainer bookings retrieved successfully",
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
// update course status
// for trainer
const updateCourseStatus = async (req, res) => {
  const { id } = req.params;
  const { courseStatus } = req.body;
  try {
    const trainerBooking = await TrainerBooking.findByIdAndUpdate(
      id,
      { courseStatus },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerBooking,
      message: "Course status updated successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// update payment status
// for admin
const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, courseStatus } = req.body;
  try {
    const trainerBooking = await TrainerBooking.findByIdAndUpdate(
      id,
      { paymentStatus, courseStatus },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerBooking,
      message: "Payment status updated successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// total price calculation for a trainer booking model and paymentStatus is approved
// for admin
const totalPriceCalculation = async (req, res) => {
  try {
    const totalPrice = await TrainerBooking.aggregate([
      {
        $match: {
          paymentStatus: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);
    res.status(StatusCodes.OK).json({
      success: true,
      data: totalPrice,
      message: "Total price calculated successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// total price calculation for a trainer booking model and paymentStatus is approved
// for admin
const totalPriceCalculationForTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    const totalPrice = await TrainerBooking.aggregate([
      {
        $match: {
          paymentStatus: "approved",
          trainer: id,
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
        },
      },
    ]);
    res.status(StatusCodes.OK).json({
      success: true,
      data: totalPrice,
      message: "Total price calculated successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
module.exports = {
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
};

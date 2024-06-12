const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const TrainerBooking = require("../models/TrainerBooking");
const User = require("../models/User");
const Class = require("../models/Class");
const Trainer = require("../models/Trainer");

// add a new trainer booking
const addTrainerBooking = async (req, res) => {
  try {
    const trainerBookingInstance = await TrainerBooking.create(req.body);
    // increment the class booked count
    const classInstance = await Class.findByIdAndUpdate(
      req.body.class,
      { $inc: { bookingCount: 1 } },
      { new: true }
    );
    // increment the trainer booked count
    const trainerInstance = await Trainer.findByIdAndUpdate(
      req.body.trainer,
      { $inc: { bookedCount: 1 } },
      { new: true }
    );
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
        .populate("class")
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
        .populate("class")
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
        .populate("class")
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
      {
        $project: {
          _id: 0,
          totalPrice: 1,
        },
      }
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

// get all booking by class and return total price
const totalPriceCalculationByClass = async (req, res) => {
  const { id } = req.params;
  try {
    const totalPrice = await TrainerBooking.aggregate([
      {
        $match: {
          class: new mongoose.Types.ObjectId(id),
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

    if (totalPrice.length > 0) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: totalPrice[0].totalPrice,
        message: "Total price calculated successfully",
      });
    } else {
      res.status(StatusCodes.OK).json({
        success: true,
        data: 0,
        message: "No approved payments found for this class",
      });
    }
  } catch (error) {
    console.error('Error calculating total price:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
}
const totalPriceCalculationByClasses = async (req, res) => {
  try {
    const totalPrices = await TrainerBooking.aggregate([
      {
        $match: {
          paymentStatus: "approved",
        },
      },
      {
        $group: {
          _id: "$class",
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          class: "$_id",
          totalPrice: 1,
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      data: totalPrices,
      message: "Total prices calculated successfully",
    });
  } catch (error) {
    console.error('Error calculating total prices:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
}

// get all unique paid members
// for admin
const getUniquePaidMembers = async (req, res) => {
  try {
    const uniquePaidMembers = await TrainerBooking.aggregate([
      {
        $match: {
          paymentStatus: "approved",
        },
      },
      {
        $group: {
          _id: "$user",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: 1,
            displayName: 1,
            email: 1,
          },
        },
      }
    ]);
    res.status(StatusCodes.OK).json({
      success: true,
      data: uniquePaidMembers,
      message: "Unique paid members retrieved successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
}


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
  totalPriceCalculationByClass,
  totalPriceCalculationByClasses,
  getUniquePaidMembers,
};

import { StatusCodes } from "http-status-codes";
import TrainerBooking from "../models/TrainerBooking";
import User from "../models/User";

/*sample data
{
  "trainer": "60e5f4b5c3e9d3b3f0f3b3b3",
  "user": "60e5f4b5c3e9d3b3f0f3b3b3",
  "date": "2021-07-08", 
  "slotTime": {
    "slotName": "morning",
    "scheduleTime": "6.00 AM"
  },
  "package": "premium",
  "status": "approved",
  "traisactionId": "123456",
  "price": 100
}

*/

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
const getAllTrainerBookings = async (req, res) => {
  const { page = 1, limit = 10, trainerId } = req.query;
  try {
    if (trainerId) {
      const trainerBookings = await TrainerBooking.find({ trainer: trainerId })
        .populate("user")
        .populate("trainer")
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

// get all trainer bookings with pagination and sorting and filtering using user name

const getAllUserBookings = async (req, res) => {
  const { page = 1, limit = 10, userName } = req.query;
  try {
    const userId = await User.findOne({
      displayName: userName,
    }).select("_id");
    if (userId) {
      const userBookings = await TrainerBooking.find({ user: userId })
        .populate("user")
        .populate("trainer")
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

// get all data of using trainer and date and slot time
const getTrainerBookingByDate = async (req, res) => {
  const { trainerId, date, scheduleTime } = req.query;
  try {
    if (scheduleTime) {
      const trainerBookings = await TrainerBooking.find({
        trainer: trainerId,
        date,
        'slotTime.scheduleTime': scheduleTime,
      })
        .populate("user")
        .populate("trainer");
      res.status(StatusCodes.OK).json({
        success: true,
        data: trainerBookings,
        message: "Trainer bookings retrieved successfully",
      });
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
// sample data
// {
//   "trainerId": "60e5f4b5c3e9d3b3f0f3b3b3",
//   "date": "2021-07-08",
//     "scheduleTime": "6.00 AM"
// }

module.exports = {
  addTrainerBooking,
  getAllTrainerBookings,
  getAllUserBookings,
  getTrainerBookingByDate,
};

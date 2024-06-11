const { StatusCodes } = require("http-status-codes");
const Trainer = require("../models/Trainer");
const TrainerBooking = require("../models/TrainerBooking");
const User = require("../models/User");
// add a new trainer
const addTrainer = async (req, res) => {
  try {
    const trainerInstance = await Trainer.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: trainerInstance,
      message: "Trainer added successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// update a trainer -> slot time
const updateTrainer = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const trainerInstance = await Trainer.findByIdAndUpdate(
      trainerId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerInstance,
      message: "Trainer updated",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// active/inactive a trainer by changing status -> status(active/rejected)
const validateTrainer = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    let { status, rejectedReason = "" } = req.body;
    status === "rejected" ? rejectedReason : (rejectedReason = "");
    const trainerInstance = await Trainer.findByIdAndUpdate(
      trainerId,
      { status: status, rejectedReason: rejectedReason },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    const userInstance = await User.findByIdAndUpdate(
      trainerInstance.userInfo,
      { role: status === "active" ? "trainer" : "member" },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Trainer status updated to: ${status} successfully`,
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all trainers with pagination sorting and filtering
// we can filter by trainer name
// pagination and sorting is also available but not mandatory
const getTrainers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt", queryText } = req.query;
    const query = {};
    if (queryText) {
      query.name = { $regex: queryText, $options: "i" };
    }
    query.status = "active";
    const trainers = await Trainer.find(query)
      .populate("classes")
      .populate("userInfo")
      .limit(limit)
      .skip(limit * (page - 1))
      .sort(sort);
    const totalCount = await Trainer.countDocuments(query);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { trainers, count: totalCount },
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get trainer with status pending for admin with pagination sorting and filtering
// we can filter by trainer name
const getPendingTrainers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt", queryText } = req.query;
    const query = {};
    if (queryText) {
      query.name = { $regex: queryText, $options: "i" };
    }
    query.status = "pending";
    const trainers = await Trainer.find(query)
      .populate("classes")
      .populate("userInfo")
      .limit(limit)
      .skip(limit * (page - 1))
      .sort(sort);
    const totalCount = await Trainer.countDocuments(query);
    res.status(StatusCodes.OK).json({
      success: true,
      data: { trainers, count: totalCount },
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
// get a single trainer by id
const getTrainer = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const trainerInstance = await Trainer.findById(trainerId)
      .populate("classes")
      .populate("userInfo");
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerInstance,
      message: "Trainer found",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// delete a slot time
const deleteSlot = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const { slotId, scheduleTime } = req.body;
    const trainerInstance = await Trainer.findByIdAndUpdate(
      trainerId,
      { $pull: { slotTime: { _id: slotId } } },
      {
        new: true,
        runValidators: true,
      }
    );
    // after deleting a slot time, update bookingModel to courseStatus:cancelled and paymentStatus:refunded
    const updateBooking = await TrainerBooking.updateMany(
      {
        trainer: trainerId,
        "slotTime.scheduleTime": scheduleTime,
      },
      { courseStatus: "cancelled", paymentStatus: "refunded" }
    );
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerInstance,
      message: "Slot time deleted",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// add new slot time
const addSlot = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const trainerInstance = await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { slotTime: req.body.slotTime }, classes: req.body.classes },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: trainerInstance,
      message: "Slot time added",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// delete a trainer and update the user role to member
const deleteTrainer = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const trainerInstance = await Trainer.findByIdAndDelete(trainerId);
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }
    const userInstance = await User.findByIdAndUpdate(
      trainerInstance.userInfo,
      { role: "member" },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Trainer deleted",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
module.exports = {
  addTrainer,
  updateTrainer,
  validateTrainer,
  getTrainers,
  getTrainer,
  deleteSlot,
  addSlot,
  deleteTrainer,
  getPendingTrainers
};

const { StatusCodes } = require("http-status-codes");
const Trainer = require("../models/Trainer");

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

// update break time for a trainer -> break time(true/false)
const updateBreakTime = async (req, res) => {
  try {
    const { id: trainerId } = req.params;
    const { slotName, scheduleTime, breakValue } = req.body;

    // find the trainer
    const trainerInstance = await Trainer.findById(trainerId);
    if (!trainerInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Trainer not found" });
      return;
    }

    // find the slot time
    const slotTime = trainerInstance.slotTime.find(
      (slot) => slot.slotName === slotName && slot.scheduleTime === scheduleTime
    );
    if (!slotTime) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Slot time not found" });
      return;
    }
    // update the break time
    slotTime.break = breakValue;
    await trainerInstance.save();
    res.status(StatusCodes.OK).json({
      success: true,
      data: trainerInstance,
      message: "Break time updated",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// active/inactive a trainer by changing status -> status(active/inactive/rejected)
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
const getTrainers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt", queryText } = req.query;
    const query = {};
    if (queryText) {
      query.name = { $regex: queryText, $options: "i" };
    }
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

module.exports = {
  addTrainer,
  updateTrainer,
  updateBreakTime,
  validateTrainer,
  getTrainers,
  getTrainer,
};

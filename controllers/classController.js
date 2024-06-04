const { StatusCodes } = require("http-status-codes");
const Class = require("../models/Class");

// add a new class
const addClass = async (req, res) => {
  try {
    const classInstance = await Class.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      data: classInstance,
      message: "Class added successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// update a class
const updateClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const classInstance = await Class.findByIdAndUpdate(classId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!classInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Class not found" });
      return;
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: classInstance, message: "Class updated" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// delete a class
const deleteClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const classInstance = await Class.findByIdAndDelete(classId);
    if (!classInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Class not found" });
      return;
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Class deleted" });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get all classes with pagination and searchquery and sort
const getClasses = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "", sort = "createdAt" } = req.query;
    const classes = await Class.find({
      name: { $regex: search, $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sort]: -1 });
    const count = await Class.countDocuments({
      name: { $regex: search, $options: "i" },
    });
    res.status(StatusCodes.OK).json({
      success: true,
      data: { classes, total:count },
    });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

// get single class
const getClass = async (req, res) => {
  try {
    const { id: classId } = req.params;
    const classInstance = await Class.findById(classId);
    if (!classInstance) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Class not found" });
      return;
    }
    res.status(StatusCodes.OK).json({ success: true, data: classInstance });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};
module.exports = { addClass,updateClass,deleteClass,getClasses,getClass };

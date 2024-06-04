const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// login and register
const fireAuth = async (req, res) => {
  const { email, displayName, photoURL } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(StatusCodes.OK).json({
        success: true,
        data: { user, token },
        message: "User logged in",
      });
    } else {
      user = await User.create({ email, displayName, photoURL });
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: { user, token },
        message: "User created",
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// update lastLogInTime
const updateLastLogin = async (req, res) => {
  const { email, lastLogin } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      user = await User.findOneAndUpdate(
        { email },
        { lastLogin: lastLogin },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "last login time updated", user });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// update user
const updateUser = async (req, res) => {
  const { email, displayName, photoURL } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    }
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    if (user) {
      user = await User.findOneAndUpdate(
        { email },
        { displayName, photoURL },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "user data updated", user });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// update role
const updateRole = async (req, res) => {
  const { email, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    if (user) {
      user = await User.findOneAndUpdate({ email }, { role }, { new: true });
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "user role updated", user });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

// get users with pagination by role
const getUsers = async (req, res) => {
  // const { role, page = 1 } = req.params;
  const { name,role,page=1 } = req.query;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    let users;
    let totalUsers;
    if (role && name) {
      users = await User.find({
        role,
        displayName: { $regex: name, $options: "i" },
      })
        .limit(limit)
        .skip(skip);
      
      totalUsers = await User.find({
        role,
        displayName: { $regex: name, $options: "i" },
      }).countDocuments();
    } else if (role) {
      users = await User.find({ role }).limit(limit).skip(skip);
      totalUsers = await User.find({ role }).countDocuments();
    } else if (name) {
      users = await User.find({ displayName: { $regex: name, $options: "i" } })
        .limit(limit)
        .skip(skip);
      totalUsers = await User.find({ displayName: { $regex: name, $options: "i" } }).countDocuments();
    } else {
      users = await User.find().limit(limit).skip(skip);
      totalUsers = await User.find().countDocuments();
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "All users", users, totalUsers});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};
// check if user is logged in
const isLogin = (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "User is logged in", login: true });
};

module.exports = { fireAuth, updateUser, isLogin, updateLastLogin, updateRole, getUsers };

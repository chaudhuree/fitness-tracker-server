const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
// for checking if the user is logged in or not
const isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    /*
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; //req.user has the user id stored in it

    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized" });
  }
};
// check if user is Trainer
const isTrainer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (user.role === "trainer") {
      next();
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Forbidden" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};
// check if user is Admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (user.role === "admin") {
      next();
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Forbidden" });
    }
  }
  catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error-admin" });
  }
}

//  check if user is trainer or admin
const isTrainerOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (user.role === "trainer" || user.role === "admin") {
      next();
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ success: false, message: "Forbidden" });
    }
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = { isLoggedIn, isTrainer, isAdmin, isTrainerOrAdmin };

const express = require("express");

const router = express.Router();

const {
  addClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController.js");
const { isAdmin,isLoggedIn } = require("../middleware/authentication.js");

router.get("/class", getClasses);
router.post("/class/add", addClass);
router.get("/class/:id", getClass);
router.put("/class/update/:id", updateClass);
router.delete("/class/delete/:id",isLoggedIn,isAdmin, deleteClass);

module.exports = router;

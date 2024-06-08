const express = require("express");

const router = express.Router();

const {
  addTrainer,
  updateTrainer,
  updateBreakTime,
  validateTrainer,
  getTrainers,
  getTrainer,
} = require("../controllers/trainerController.js");

router.post("/trainer/add", addTrainer);
router.get("/trainer", getTrainers); //get all trainers with pagination sorting and filtering
router.get("/trainer/:id", getTrainer); //get a single trainer by id
router.put("/trainer/validate/:id", validateTrainer); //validate trainer (active/inactive/rejected) ---- note: if rejected then add reason
router.put("/trainer/update/:id", updateTrainer); //slot time or class update
router.put("/trainer/breaktime/:id", updateBreakTime); // add or remove break time

module.exports = router;

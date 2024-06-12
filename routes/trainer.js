const express = require("express");

const router = express.Router();

const {
  addTrainer,
  updateTrainer,
  validateTrainer,
  getTrainers,
  getTrainer,
  deleteSlot,
  addSlot,
  deleteTrainer,
  getPendingTrainers,
  getTrainerByUserId
} = require("../controllers/trainerController.js");

router.post("/trainer/add", addTrainer);
router.get("/trainer", getTrainers); //get all trainers with pagination sorting and filtering
router.get("/trainer/pending", getPendingTrainers); //get all pending trainers
router.get("/trainer/:id", getTrainer); //get a single trainer by id
router.put("/trainer/validate/:id", validateTrainer); //validate trainer (active/inactive/rejected) ---- note: if rejected then add reason
router.put("/trainer/update/:id", updateTrainer); //slot time(available time slot) or class update
router.delete("/trainer/slot/delete/:id", deleteSlot); //delete slot time
router.put("/trainer/slot/add/:id", addSlot); //add slot time
router.delete("/trainer/delete/:id", deleteTrainer); //delete trainer
router.get("/trainer/user/:id", getTrainerByUserId); //get trainer by user id

module.exports = router;

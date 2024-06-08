const mongoose = require("mongoose");

// Define the social social links schema
const socialSchema = new mongoose.Schema({
  facebook: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  instagram: {
    type: String,
    required: true,
  },
});

// Define the slotTime time slot schema
const slotTimeSchema = new mongoose.Schema({
  slotName: { type: String, required: true },
  scheduleTime: { type: String, required: true },
  seatCapacity: { type: Number, required: true, default: 0 },
});

// define the package schema
const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["basic", "standard", "premium"],
    required: true,
  },
  price: { type: Number, required: true },
});

const TrainerSchema = new mongoose.Schema(
  {
    userInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    yearsOfexperience: {
      type: Number,
      required: true,
    },
    social: {
      type: socialSchema,
      required: true,
    },
    availableTimeSlot: {
      type: String,
      required: true,
    },
    slotTime: {
      type: [slotTimeSchema],
      required: true,
    },
    availableDays: {
      type: [String],
      required: true,
    },
    areaOfExpertise: {
      type: [String],
      required: true,
    },
    classes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected","inactive"],
      default: "pending",
    },
    rejectedReason: {
      type: String,
    },
    packages: {
      type: [packageSchema],
      required: true,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Trainer", TrainerSchema);


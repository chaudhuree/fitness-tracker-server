const mongoose = require("mongoose");

// Define the slotTime subdocument schema
const slotTimeSchema = new mongoose.Schema({
  slotName: { type: String, required: true },
  scheduleTime: { type: String, required: true },
});

const TrainerBookingSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { //-> booking training date
      type: Date,
      required: true,
    },
    slotTime: {
      type: slotTimeSchema,
      required: true,
    },
    package: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    traisactionId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TrainerBooking", TrainerBookingSchema);

/*sample data
{
  "trainer": "60e5f4b5c3e9d3b3f0f3b3b3",
  "user": "60e5f4b5c3e9d3b3f0f3b3b3",
  "date": "2021-07-08", 
  "slotTime": {
    "slotName": "Morning",
    "scheduleTime": "6am"
  },
  "package": "premium",
  "status": "approved",
  "traisactionId": "123456",
  "price": 100
}

*/

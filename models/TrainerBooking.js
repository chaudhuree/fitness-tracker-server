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
    slotTime: {
      type: slotTimeSchema,
      required: true,
    },
    package: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "approved", "cancelled", "refunded"],
      default: "pending",
    },
    courseStatus: {
      type: String,
      enum: ["completed", "inprogress", "cancelled"],
      default: "inprogress",
    },
    transactionId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    class:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    }
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
    "slotName": "morning",
    "scheduleTime": "6.00 AM"
  },
  "package": "premium",
  "paymentStatus": "approved",
  "courseStatus": "inprogress",
  "traisactionId": "123456",
  "price": 100
}

*/

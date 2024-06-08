const mongoose = require("mongoose");

const ClassBookingSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("ClassBooking", ClassBookingSchema);

/*sample data
{
  "class": "60e5f4b5c3e9d3b3f0f3b3b3",
  "user": "60e5f4b5c3e9d3b3f0f3b3b3",
  "package": "standard",
  "status": "pending",
  "traisactionId": "1234",
  "price": 500
}

*/

const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    trainers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trainer" }],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: (props) => `You can't have more than 5 trainers`,
      },
    },
    startDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String
    },
    status: {
      type: String,
      enum: ["scheduled", "on going", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Class", ClassSchema);

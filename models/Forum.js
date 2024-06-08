const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Forum = mongoose.model("Forum", forumSchema);

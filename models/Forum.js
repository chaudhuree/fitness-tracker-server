const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    subtitle: {
      type: String,
      required: [true, "Please provide a subtitle"],
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
      type: [mongoose.Schema.Types.ObjectId],
    },
    downvotes: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true, versionKey: false }
);

const Forum = mongoose.model("Forum", forumSchema);

module.exports = Forum;

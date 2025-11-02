const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "Message is required"],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// populate sender name and receiver name
messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: "senderId",
    select: "name  email",
  });
  this.populate({
    path: "receiverId",
    select: "name  email",
  });
  next();
});

module.exports = mongoose.model("Message", messageSchema);

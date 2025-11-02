const expressAsyncHandler = require("express-async-handler");

const User = require("../model/user.model");
const Message = require("../model/message.model");
const ApiError = require("../utils/ApiError");

exports.getAllContacts = expressAsyncHandler(async (req, res, next) => {
  const loggedUserId = req.user._id;

  const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select(
    "-password"
  );

  if (!filteredUsers) {
    return next(new ApiError("No users found", 404));
  }
  res.status(200).json({
    status: "success",
    data: filteredUsers,
  });
});

exports.getMessagesByUserId = expressAsyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const { id: userToChatWithId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: myId, receiver: userToChatWithId },
      { sender: userToChatWithId, receiver: myId },
    ],
  });

  if (!messages) {
    return next(new ApiError("No messages found", 404));
  }

  res.status(200).json({
    status: "success",
    data: messages,
  });
});

const expressAsyncHandler = require("express-async-handler");

const User = require("../model/user.model");
const Message = require("../model/message.model");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");

exports.getAllContacts = expressAsyncHandler(async (req, res, next) => {
  const loggedUserId = req.user._id;

  const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select(
    "-password"
  );

  if (!filteredUsers || filteredUsers.length === 0) {
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
      { senderId: myId, receiverId: userToChatWithId },
      { senderId: userToChatWithId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 });

  if (messages.length === 0) {
    return next(new ApiError("No messages found", 404));
  }

  res.status(200).json({
    status: "success",
    data: messages,
  });
});

// @desc    Send a message (text + optional image)
// @route   POST /api/messages/send/:id
// @access  Private
exports.sendMessage = expressAsyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const { id: userToChatWithId } = req.params;
  const { text } = req.body;

  let imageUrl = null;

  // 1️⃣ Upload image to Cloudinary if provided
  if (req.file) {
    try {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "chat_app/messages",
      });
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error);
      return next(new ApiError("Image upload failed. Please try again.", 500));
    }
  }

  // 2️⃣ Create new message
  const message = await Message.create({
    senderId: myId,
    receiverId: userToChatWithId,
    text,
    image: imageUrl,
  });

  // 3️⃣ Respond
  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
    data: message,
  });
});

const expressAsyncHandler = require("express-async-handler");

const User = require("../model/user.model");
const Message = require("../model/message.model");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary");

// @desc    Get all contacts
// @route   GET /api/messages
// @access  Private
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

// @desc    Get all messages between two users
// @route   GET /api/messages/:id
// @access  Private
exports.getMessagesByUserId = expressAsyncHandler(async (req, res, next) => {
  const myId = req.user._id;
  const { id: userToChatWithId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatWithId },
      { senderId: userToChatWithId, receiverId: myId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("senderId receiverId");

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
  // send message (real time using socket.io)
  // 3️⃣ Respond
  res.status(201).json({
    status: "success",
    message: "Message sent successfully",
    data: message,
  });
});

// @desc    Get chat parteners
// @route   GET /api/messages/chats
// @access  Private
exports.getChatPartners = expressAsyncHandler(async (req, res, next) => {
  const myId = req.user._id;

  //find all messages for logged-user both (sender or receiver)
  const messages = await Message.find({
    $or: [{ senderId: myId }, { receiverId: myId }],
  });
  if (messages.length === 0) {
    return next(new ApiError("No messages found", 404));
  }

  const chatPartners = [
    ...new Set(
      messages.map((msg) =>
        msg.senderId.toString() === myId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString()
      )
    ),
  ];

  if (chatPartners.length === 0) {
    return next(new ApiError("No chat parteners found", 404));
  }

  const filteredChatPartners = await User.find({
    _id: { $in: chatPartners },
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: filteredChatPartners,
  });
});

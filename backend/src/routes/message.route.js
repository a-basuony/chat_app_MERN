const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const {
  getAllContacts,
  sendMessage,
} = require("../controllers/message.controller");
const { getMessagesByUserId } = require("../controllers/message.controller");
const upload = require("../middlewares/uploadImageMiddleware");
// get all contacts
router.route("/").get(protect, getAllContacts);
// messages between me and another user
router.route("/:id").get(protect, getMessagesByUserId);
// send message to another user
router.route("/send/:id").post(protect, upload.single("image"), sendMessage);

module.exports = router;

const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const {
  getAllContacts,
  sendMessage,
  getChatPartners,
} = require("../controllers/message.controller");
const { getMessagesByUserId } = require("../controllers/message.controller");
const upload = require("../middlewares/uploadImageMiddleware");

router.use(protect);
// get all contacts
router.route("/").get(getAllContacts);
// get chats partners messages for logged-in user is either sender or receiver
router.route("/chats").get(getChatPartners);
// messages between me and another user
router.route("/:id").get(getMessagesByUserId);
// send message to another user
router.route("/send/:id").post(upload.single("image"), sendMessage);

module.exports = router;

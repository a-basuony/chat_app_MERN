const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { getAllContacts } = require("../controllers/message.controller");
const { getMessagesByUserId } = require("../controllers/message.controller");

router.route("/").get(protect, getAllContacts);
router.route("/:id").get(protect, getMessagesByUserId);
router.route("/send/:id").post(protect, sendMessage);
// .get(protectRoute.protect, getMessages);

module.exports = router;

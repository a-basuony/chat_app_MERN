const multer = require("multer");

// Memory storage: keeps file in RAM (not on disk)
const storage = multer.memoryStorage();

// Accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");

const authRouter = require("./routes/auth.route");
const messageRouter = require("./routes/message.route");

dotenv.config();

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const {
  globalError,
  notFound,
} = require("./middlewares/globalErrorMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // parse Json body
// app.use(express.urlencoded({ extended: false })); // parse urlencoded body

// routes
app.use("/api/auth", authRoutes);

// ✅ API routes (placeholder)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend API working!" });
});

// ✅ Error handlers
app.use(notFound);
app.use(globalError);

// ✅ Start server
let server;

connectDB()
  .then(() => {
    server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  });
// ---------------------------------------------
// 🔥 Process Handlers
// ---------------------------------------------
process.on("unhandledRejection", (err) => {
  console.error(`💥 Unhandled Rejection: ${err.name} | ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

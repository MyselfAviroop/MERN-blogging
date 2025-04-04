import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { config } from "dotenv";

// Load environment variables
config();

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Set PORT
const PORT = process.env.PORT || 5100;

// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("MongoDB connection has been established!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import { protect } from "./middleware/authMiddleware.js";

app.use("/auth", authRouter);
app.use("/server/posts", protect, postsRouter);
app.get("/", (req, res) => {
  res.send(" running...");
});
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Start server
app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}!`));

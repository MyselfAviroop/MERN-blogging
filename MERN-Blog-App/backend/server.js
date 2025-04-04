import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";

// Load environment variables
config();

// Initialize Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: 'https://mern-blogging-3zvq.vercel.app',
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// MongoDB connection with optimized settings for serverless
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10,
      minPoolSize: 5
    };

    await mongoose.connect(uri, options);
    console.log("MongoDB connection has been established!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

// Connect to MongoDB
connectDB();

// Routes
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import { protect } from "./middleware/authMiddleware.js";

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", protect, postsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// For Vercel serverless
export default app;

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
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", uri ? "URI exists" : "URI is missing");
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5
    };

    await mongoose.connect(uri, options);
    console.log("MongoDB connection has been established!");
  } catch (err) {
    console.error("MongoDB connection error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    // Don't throw the error, just log it
  }
};

// Connect to MongoDB
connectDB();

// Routes
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import { protect } from "./middleware/authMiddleware.js";

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", protect, postsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  });
  
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// For Vercel serverless
export default app;

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

// Cache the MongoDB connection
let cachedDb = null;
let isConnecting = false;

// MongoDB connection with optimized settings for serverless
const connectDB = async () => {
  try {
    if (cachedDb) {
      console.log("Using cached MongoDB connection");
      return cachedDb;
    }

    if (isConnecting) {
      console.log("Connection in progress, waiting...");
      return new Promise((resolve, reject) => {
        const checkConnection = setInterval(() => {
          if (cachedDb) {
            clearInterval(checkConnection);
            resolve(cachedDb);
          }
        }, 100);
      });
    }

    isConnecting = true;
    const uri = process.env.MONGO_URI;
    console.log("Attempting to connect to MongoDB Atlas...");
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000, // Further reduced for faster failure detection
      socketTimeoutMS: 20000, // Further reduced for serverless
      maxPoolSize: 3, // Further reduced for serverless
      minPoolSize: 1,
      connectTimeoutMS: 3000, // Further reduced for serverless
      retryWrites: true,
      w: 'majority',
      appName: 'Cluster0',
      maxIdleTimeMS: 20000, // Reduced idle time
      heartbeatFrequencyMS: 5000, // More frequent health checks
      autoIndex: false,
      family: 4 // Force IPv4
    };

    const db = await mongoose.connect(uri, options);
    console.log("MongoDB Atlas connection has been established!");
    cachedDb = db;
    isConnecting = false;
    return db;
  } catch (err) {
    isConnecting = false;
    console.error("MongoDB connection error details:", {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    throw err;
  }
};

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
import postsRouter from "./routes/posts.js";
import authRouter from "./routes/auth.js";
import { protect } from "./middleware/authMiddleware.js";

// Connect to MongoDB before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      message: "Database connection error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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

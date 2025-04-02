import express from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// 🟢 User Registration Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Registration attempt for email:", email);

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user without manually hashing password
        // The pre-save middleware will handle hashing
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            console.log("User created successfully:", {
                id: user._id,
                email: user.email,
                name: user.name
            });
            
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ message: error.message });
    }
});

// 🟢 User Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);
        console.log("Password received:", password);

        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            console.log("No user found with email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Log stored password hash
        console.log("Stored password hash:", user.password);

        // Compare passwords using bcrypt directly
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("Login successful!");
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});


// 🟢 Get User Profile Route (Protected)
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
});

export default router;

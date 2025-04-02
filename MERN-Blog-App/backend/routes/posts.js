import express from "express";
import Post from "../models/post.model.js";

const router = express.Router();

// Root route
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const posts = await Post.find()
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);
            
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Error fetching posts" });
    }
});

// Route to display a particular post
router.get("/:id", async (req, res) => {
    try {
        console.log("Fetching post with ID:", req.params.id);
        const post = await Post.findById(req.params.id);
        if (!post) {
            console.log("Post not found with ID:", req.params.id);
            return res.status(404).json({ message: "Post not found" });
        }
        console.log("Post found:", post.title);
        res.json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ message: "Error fetching post" });
    }
});

// Route to add a new post
router.post("/", async (req, res) => {
    try {
        const { title, body } = req.body;
        const newPost = new Post({
            title,
            body,
            author: req.user._id,
            date: new Date(),
            comments: [],
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Error creating post" });
    }
});

// Route to edit a particular post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user owns the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this post" });
        }

        post.title = req.body.title;
        post.body = req.body.body;
        post.updatedAt = new Date();

        await post.save();
        res.json(post);
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ message: "Error updating post" });
    }
});

// Route to delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user owns the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Error deleting post" });
    }
});

export default router; // ✅ Export as ES Module

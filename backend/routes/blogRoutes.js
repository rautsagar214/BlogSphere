import express from "express";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import authenticateToken from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// Public routes
router.get("/", getBlogs); // Get all blogs
router.get("/:id", getBlogById); // Get a single blog by ID

// Protected routes (require authentication)
router.post("/create", authenticateToken, createBlog); // Create a new blog
router.put("/:id", authenticateToken, updateBlog); // Update a blog
router.delete("/:id", authenticateToken, deleteBlog); // Delete a blog
export default router;

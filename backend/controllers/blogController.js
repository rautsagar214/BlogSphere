import Blog from "../models/blog.js";


// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Updated createBlog function with image handling
export const createBlog = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { title, content, author, date } = req.body;

    if (!title || !content || !date || !author) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      date: new Date(date),
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Failed to create blog", error: err.message });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




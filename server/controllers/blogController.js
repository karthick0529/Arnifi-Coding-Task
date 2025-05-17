const Blog = require("../models/Blog");
const User = require("../models/User");

exports.getBlogs = async (req, res) => {
  const { category, author } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (author) filter.author = author;

  try {
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /blogs
exports.createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;
  try {
    const user = await User.findById(req.userId);
    const blog = await Blog.create({
      title,
      category,
      content,
      image,
      author: user.name,
      userId: user._id,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /blogs/:id
exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog || blog.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(blog, req.body, { updatedAt: Date.now() });
  await blog.save();
  res.json(blog);
};

// DELETE /blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Blog.findByIdAndDelete(blog._id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /filters
exports.getFilters = async (req, res) => {
  try {
    const categories = await Blog.distinct("category");
    const authors = await Blog.distinct("author");
    res.json({ categories, authors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

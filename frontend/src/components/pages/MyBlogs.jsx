import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Book, 
  Edit, 
  Trash2, 
  Loader2, 
  PlusCircle, 
  FileText, 
  Calendar,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `https://blogsphere-6q19.onrender.com/api/blogs/${blogId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
      alert("Failed to delete blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBlogs = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("https://blogsphere-6q19.onrender.com/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userBlogs = res.data.filter((blog) => blog.author === userId);
      setBlogs(userBlogs);
    } catch (err) {
      console.error("Error fetching blogs:", err.response?.data || err.message);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, [navigate]);

  const LoadingState = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 1 },
          scale: { 
            repeat: Infinity, 
            duration: 1, 
            ease: "easeInOut",
            repeatType: "reverse"
          }
        }}
      >
        <Loader2 
          className="text-purple-600 animate-pulse" 
          size={80} 
          strokeWidth={2} 
        />
      </motion.div>
    </motion.div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
      >
        <AlertCircle 
          className="mx-auto text-red-500 mb-6" 
          size={80} 
          strokeWidth={1.5} 
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! Something Went Wrong
        </h2>
        <p className="text-gray-600 mb-6">{error || "Unable to load blogs"}</p>
        <button 
          onClick={fetchMyBlogs}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center bg-white rounded-3xl shadow-2xl p-16 max-w-3xl mx-auto space-y-6"
    >
      <FileText 
        className="mx-auto text-purple-500" 
        size={100} 
        strokeWidth={1.2} 
      />
      <p className="text-3xl text-gray-600 font-light leading-relaxed">
        Your blog canvas is empty. 
        <br />
        Start creating your first story!
      </p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/create"
          className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
          text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Create Your First Blog
        </Link>
      </motion.div>
    </motion.div>
  );

  const BlogsList = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <motion.div
          key={blog._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-transparent hover:border-purple-300 transition-all duration-300 relative group"
        >
          <div className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-50 -z-10"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex-grow pr-4">
                {blog.title}
              </h3>
              <Calendar 
                className="text-purple-500 flex-shrink-0" 
                size={24} 
              />
            </div>
            
            <p className="text-gray-600 mb-6 line-clamp-3">
              {blog.content}
            </p>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition group"
              >
                <Book className="mr-2 group-hover:rotate-6 transition" size={20} />
                Read
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(`/edit-blog/${blog._id}`)}
                className="flex items-center bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition group"
              >
                <Edit className="mr-2 group-hover:rotate-6 transition" size={20} />
                Edit
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDelete(blog._id)}
                className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition group"
              >
                <Trash2 className="mr-2 group-hover:rotate-6 transition" size={20} />
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4"
          >
            My Blogs
          </motion.h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto m-2">
            Welcome to your personal blog collection. Here are the blogs you've created.
          </p>
        </div>

        <AnimatePresence>
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : blogs.length === 0 ? (
            <EmptyState />
          ) : (
            <BlogsList />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyBlogs;
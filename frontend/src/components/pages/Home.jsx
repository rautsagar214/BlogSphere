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

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch blogs from the server
  const fetchBlogs = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("https://blogsphere-6q19.onrender.com/api/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err.response?.data || err.message);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        // Token expired or unauthorized
        localStorage.removeItem("token");
        navigate("/login", { 
          state: { 
            message: "Your session has expired. Please log in again." 
          } 
        });
      } else {
        // Set a generic error message
        setError("Failed to fetch blogs. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete blog handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`https://blogsphere-6q19.onrender.com/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistically remove the blog from the list
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      
      // Optional: Show a success toast or notification
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { 
          state: { 
            message: "Your session has expired. Please log in again." 
          } 
        });
      } else {
        alert("Failed to delete the blog. Please try again.");
      }
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, [navigate]);

  // Loading State Component
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

  // Error State Component
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
          onClick={fetchBlogs}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:opacity-90 transition"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  // Empty State Component
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

  // Render Blogs List
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
              {[
                { 
                  icon: Book, 
                  text: 'Read', 
                  color: 'purple', 
                  action: () => navigate(`/blog/${blog._id}`)
                },
                { 
                  icon: Edit, 
                  text: 'Edit', 
                  color: 'yellow', 
                  action: () => navigate(`/edit-blog/${blog._id}`)
                },
                { 
                  icon: Trash2, 
                  text: 'Delete', 
                  color: 'red', 
                  action: () => handleDelete(blog._id)
                }
              ].map((item) => (
                <motion.button
                  key={item.text}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={item.action}
                  className={`
                    flex items-center 
                    bg-${item.color}-100 
                    text-${item.color}-700 
                    px-4 py-2 
                    rounded-lg 
                    hover:bg-${item.color}-200 
                    transition 
                    group
                  `}
                >
                  <item.icon className="mr-2 group-hover:rotate-6 transition" size={20} />
                  {item.text}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // Main Render
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
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 "
          >
            Your Digital Storytelling Hub
          </motion.h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto m-2" >
            Capture, Create, and Share Your Thoughts. Your Personal Blog Sanctuary Awaits.
             </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/create" 
              className="inline-flex items-center px-8 py-4 border-0 text-lg font-semibold rounded-full text-white 
              bg-gradient-to-r from-purple-600 to-indigo-600 shadow-2xl hover:shadow-xl 
              transition-all duration-300 ease-in-out transform hover:-translate-y-1 
              group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white opacity-20 group-hover:opacity-10 transition-opacity"></span>
              <PlusCircle className="mr-3" />
              Create New Story
              <ChevronRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
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

export default Home;
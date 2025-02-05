import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ImagePlus, Video, X, Loader2 } from "lucide-react";
// import { multer } from "multer";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    title: "", 
    content: "", 
    date: new Date().toISOString().split('T')[0],
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.title.trim() || !form.content.trim() || !form.date) {
      setError("Title, content, and date cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const author = localStorage.getItem("userId");

      if (!token || !author) {
        setError("User authentication failed. Please log in again.");
        setLoading(false);
        return;
      }

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("date", form.date);
      formData.append("author", author);
      
      console.log(formData)
      await axios.post("https://blogsphere-6q19.onrender.com/api/blogs/create", {...form, author}, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Create Your Story
          </h2>
          <p className="text-gray-600">Share your thoughts, ideas, and experiences with the world</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="Give your blog a catchy title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-lg font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={8}
                    required
                    placeholder="Write your story here..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Creating...
                    </div>
                  ) : (
                    "Publish Blog"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CreateBlog;
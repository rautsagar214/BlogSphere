import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err.response?.data || err.message);
        alert("Failed to load blog data.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, blog, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Blog updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error updating blog:", err.response?.data || err.message);
      alert("Failed to update blog.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Blog</h2>
      <form onSubmit={handleUpdate} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title:</label>
          <input
            type="text"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Content:</label>
          <textarea
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            className="w-full border p-2 rounded"
            rows="5"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;

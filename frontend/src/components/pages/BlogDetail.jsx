import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`)
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      // Assuming dateString is in YYYY-MM-DD format from the creation form
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date not available";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Blog not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="bg-white shadow-lg rounded-lg p-8 relative">
        <div className="absolute top-4 right-4 text-sm text-gray-600 font-medium">
          {formatDate(blog.date)}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{blog.title}</h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed">{blog.content}</p>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;
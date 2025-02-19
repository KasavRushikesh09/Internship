import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BlogCard = ({ blog, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/blogs/${blog.id}`);
      onDelete(blog.id); // Update the UI after successful deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>
      <p className="content-preview">
        {blog.content.substring(0, 100)}...
      </p>
      <div className="meta-info">
        <span>By {blog.author}</span>
        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
      </div>
      <div className="actions">
        <Link to={`/edit/${blog.id}`} className="edit-btn">
          Edit
        </Link>
        <button onClick={handleDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
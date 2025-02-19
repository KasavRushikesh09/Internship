import React, { useState } from 'react';
import axios from 'axios';

const BlogForm = ({ history, match }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  // Add useEffect for edit mode (GET blog by ID)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(/blogs/${match.params.id}, formData);
      } else {
        await axios.post('/blogs', formData);
      }
      history.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      {/* Add other fields similarly */}
      <button type="submit">Submit</button>
    </form>
  );
};
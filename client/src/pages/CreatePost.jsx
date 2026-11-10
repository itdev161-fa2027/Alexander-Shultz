import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import PostForm from '../components/PostForm';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (title, body) => {
    try {
      setError(null);
      setLoading(true);

      const newPost = await createPost(title, body);

      // Navigate to the new post
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        'Failed to create post. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-post-page">
      <div className="container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <PostForm
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CreatePost;

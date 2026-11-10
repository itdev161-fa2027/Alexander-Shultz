import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { getPostById, updatePost } from '../services/api';
import PostForm from '../components/PostForm';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);

        // Verify user owns the post
        if (data.user?._id !== user.id) {
          setError("You don't have permission to edit this post.");
          setLoading(false);
          return;
        }

        setPost(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError('Failed to load post. It may not exist or the server is down.');
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleSubmit = async (title, body) => {
    try {
      setError(null);
      setSubmitting(true);

      await updatePost(id, title, body);

      // Navigate to the updated post
      navigate(`/posts/${id}`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        'Failed to update post. Please try again.';
      setError(errorMsg);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  if (loading) {
    return <div className="container loading">Loading post...</div>;
  }

  if (error && !post) {
    return (
      <div className="container error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          {'\u2190'} Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="edit-post-page">
      <div className="container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <PostForm
          mode="edit"
          initialData={post}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default EditPost;

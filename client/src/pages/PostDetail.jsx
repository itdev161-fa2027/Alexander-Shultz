import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, deletePost } from '../services/api';
import { AuthContext } from '../context/authContext';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        setError(
          'Failed to load post. It may not exist or the server is down.',
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = () => {
    navigate(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deletePost(id);
        navigate('/');
      } catch (err) {
        const errorMsg =
          err.response?.data?.msg ||
          'Failed to delete post. Please try again.';
        alert(errorMsg);
      }
    }
  };

  // Check if current user owns the post
  const canModify = user && post && user.id === post.user?._id;

  if (loading) {
    return <div className="container loading">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="container error">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          {'\u2190'} Back to Home
        </button>
      </div>
    );
  }

  if (!post) {
    return <div className="container error">Post not found.</div>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="back-button">
        {'\u2190'} Back to Posts
      </button>
      <article className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-detail-meta">
          <span className="post-detail-author">
            By {post.user?.name || 'Unknown'}
          </span>
          <span className="post-detail-date">
            {formatDate(post.createDate)}
          </span>
        </div>
        <div className="post-detail-body">
          {post.body.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {canModify && (
          <div className="post-actions">
            <button onClick={handleEdit} className="edit-button">
              Edit Post
            </button>
            <button onClick={handleDelete} className="delete-button">
              Delete Post
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;

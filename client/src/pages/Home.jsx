import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(
          'Failed to load posts. Make sure the backend server is running.',
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="container loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>Recent Posts</h1>
        {/* Create Post button will be added in Activity 9 */}
      </div>
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Check back later!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

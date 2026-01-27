import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function Home() {
  const { state, getIDToken } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  useEffect(() => {
    fetchPosts();
    if (state.isAuthenticated) {
      getCurrentUserEmail();
    }
  }, [state.isAuthenticated]);

  const getCurrentUserEmail = async () => {
    try {
      const token = await getIDToken();
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserEmail(payload.username || payload.email || payload.sub);
    } catch (err) {
      console.error("Error getting user email:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/posts`);

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      toast.error("Error fetching posts: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!state.isAuthenticated) {
      toast.warn("Please sign in to delete posts");
      return;
    }

    try {
      setLoading(true);
      const token = await getIDToken();

      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }

      toast.success("Post deleted successfully!");
      setTimeout(() => {
        fetchPosts();
      }, 500);
    } catch (err) {
      toast.error("Error deleting post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No posts yet</h3>
        <p>Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
          currentUserEmail={currentUserEmail}
        />
      ))}
    </div>
  );
}

export default Home;

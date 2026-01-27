import { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function Home() {
  const { state, getIDToken } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetchPosts();
    if (state.isAuthenticated) {
      getIDToken().then((token) => {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.username || payload.email || payload.sub);
      });
    }
  }, [state.isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API}/posts`);
      if (res.ok) setPosts(await res.json());
    } catch (err) {
      toast.error("Failed to load posts");
    }
  };

  const handleDelete = async (postId) => {
    if (!state.isAuthenticated) return toast.warn("Sign in to delete");
    try {
      const token = await getIDToken();
      const res = await fetch(`${API}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Deleted!");
        fetchPosts();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  if (!posts.length)
    return (
      <div className="empty-state">
        <h3>No posts yet</h3>
      </div>
    );

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={handleDelete}
          currentUserEmail={userEmail}
        />
      ))}
    </div>
  );
}

export default Home;

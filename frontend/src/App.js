import React, { useState, useEffect } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function App() {
  const { state, signIn, signOut, getIDToken } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchPosts();
    }
  }, [state.isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = await getIDToken();

      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getIDToken();

      const url = editingPost
        ? `${API_BASE_URL}/posts/${editingPost.id}`
        : `${API_BASE_URL}/posts`;

      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save post");
      }

      toast.success(
        editingPost
          ? "Post updated successfully!"
          : "Post created successfully!",
      );
      setFormData({ title: "", content: "" });
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      toast.error("Error saving post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    const deletePost = async () => {
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

        // Small delay to show toast before refreshing
        setTimeout(() => {
          fetchPosts();
        }, 500);
      } catch (err) {
        toast.error("Error deleting post: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    toast.warn(
      <div>
        <p style={{ marginBottom: "10px" }}>
          Are you sure you want to delete this post?
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => {
              deletePost();
              toast.dismiss();
            }}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      },
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: "", content: "" });
  };

  const handleNewPost = () => {
    setShowForm(true);
    setEditingPost(null);
    setFormData({ title: "", content: "" });
  };

  if (!state.isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Welcome to Blog App</h2>
        <p>Please sign in to continue</p>
        <button onClick={() => signIn()}>Sign In with Asgardeo</button>
      </div>
    );
  }

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="header">
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        >
          Blogy
        </h1>
        <div className="header-actions">
          <button onClick={handleNewPost}>New Post</button>
          <button onClick={() => signOut()} className="secondary">
            Sign Out
          </button>
        </div>
      </div>

      {showForm && (
        <div className="post-form">
          <h2>{editingPost ? "Edit Post" : "Create New Post"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter post title"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your post content here..."
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingPost
                    ? "Update Post"
                    : "Create Post"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm && <div className="loading">Loading...</div>}

      {!loading && posts.length === 0 && (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Be the first to create a post!</p>
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div>
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">
                  By {post.authorEmail} •{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <button onClick={() => handleEdit(post)} className="secondary">
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} className="danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

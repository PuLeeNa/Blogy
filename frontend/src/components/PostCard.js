import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";

function PostCard({ post, onDelete, currentUserEmail }) {
  const navigate = useNavigate();
  const { state } = useAuthContext();

  const isAuthor =
    state.isAuthenticated && currentUserEmail === post.authorEmail;

  const handleEdit = () => {
    if (!state.isAuthenticated) {
      toast.warn("Please sign in to edit posts");
      return;
    }
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = () => {
    if (!state.isAuthenticated) {
      toast.warn("Please sign in to delete posts");
      return;
    }

    toast.warn(
      <div>
        <p style={{ marginBottom: "10px" }}>
          Are you sure you want to delete this post?
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => {
              onDelete(post.id);
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

  return (
    <div className="post-card">
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
      {isAuthor && (
        <div className="post-actions">
          <button onClick={handleEdit} className="secondary">
            Edit
          </button>
          <button onClick={handleDelete} className="danger">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;

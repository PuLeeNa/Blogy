import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

function PostCard({ post, onDelete, currentUserEmail }) {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const isAuthor =
    state.isAuthenticated && currentUserEmail === post.authorEmail;

  const handleDelete = () => {
    if (window.confirm("Delete this post?")) onDelete(post.id);
  };

  return (
    <div className="post-card">
      <h2 className="post-title">{post.title}</h2>
      <div className="post-meta">
        By {post.authorEmail} • {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="post-content">{post.content}</div>
      {isAuthor && (
        <div className="post-actions">
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
            className="secondary"
          >
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

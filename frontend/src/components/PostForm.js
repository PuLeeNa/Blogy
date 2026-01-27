import React, { useState } from "react";

function PostForm({
  initialData = { title: "", content: "" },
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="post-form">
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
            required
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
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Post"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;

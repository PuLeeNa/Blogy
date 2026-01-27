import { useState } from "react";

function PostForm({
  initialData = { title: "", content: "" },
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(initialData);

  return (
    <form
      className="post-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div className="form-group">
        <label>Title</label>
        <input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          disabled={loading}
          required
        />
      </div>
      <div className="form-group">
        <label>Content</label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          disabled={loading}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
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
  );
}

export default PostForm;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostForm from "../components/PostForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getIDToken, signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated) {
      toast.warn("Please sign in to edit posts");
      signIn();
      return;
    }
    fetchPost();
  }, [id, state.isAuthenticated]);

  const fetchPost = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      toast.error("Error fetching post: " + err.message);
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getIDToken();

      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update post");
      }

      toast.success("Post updated successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Error updating post: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!state.isAuthenticated) {
    return null;
  }

  if (fetching) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return null;
  }

  return (
    <div>
      <h2>Edit Post</h2>
      <PostForm
        initialData={{ title: post.title, content: post.content }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}

export default EditPost;

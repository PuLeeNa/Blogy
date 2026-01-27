import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostForm from "../components/PostForm";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function CreatePost() {
  const navigate = useNavigate();
  const { state, getIDToken, signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) {
      toast.warn("Please sign in to create posts");
      signIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAuthenticated]);

  const handleSubmit = async (formData) => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getIDToken();

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      toast.success("Post created successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Error creating post: " + err.message);
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

  return (
    <div>
      <h2>Create New Post</h2>
      <PostForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}

export default CreatePost;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostForm from "../components/PostForm";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function CreatePost() {
  const navigate = useNavigate();
  const { state, getIDToken, signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated) signIn();
  }, [state.isAuthenticated]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const token = await getIDToken();
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Post created!");
        navigate("/");
      } else {
        toast.error("Failed to create post");
      }
    } catch (err) {
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  if (!state.isAuthenticated) return null;

  return (
    <div>
      <h2>Create New Post</h2>
      <PostForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        loading={loading}
      />
    </div>
  );
}

export default CreatePost;

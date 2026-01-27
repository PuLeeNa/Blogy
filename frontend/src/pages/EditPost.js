import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { toast } from "react-toastify";
import PostForm from "../components/PostForm";

const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, getIDToken, signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!state.isAuthenticated) return signIn();
    fetch(`${API}/posts/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setPost)
      .catch(() => navigate("/"));
  }, [id, state.isAuthenticated]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const token = await getIDToken();
      const res = await fetch(`${API}/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Post updated!");
        navigate("/");
      } else {
        toast.error("Failed to update post");
      }
    } catch (err) {
      toast.error("Error updating post");
    } finally {
      setLoading(false);
    }
  };

  if (!state.isAuthenticated || !post) return null;

  return (
    <div>
      <h2>Edit Post</h2>
      <PostForm
        initialData={{ title: post.title, content: post.content }}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        loading={loading}
      />
    </div>
  );
}

export default EditPost;

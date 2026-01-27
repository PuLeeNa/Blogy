import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

function Header() {
  const navigate = useNavigate();
  const { state, signIn, signOut } = useAuthContext();

  const handleAuth = async () => {
    try {
      if (state.isAuthenticated) {
        await signOut();
      } else {
        await signIn();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert(`Authentication failed: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleNewPost = () => {
    navigate("/create");
  };

  return (
    <div className="header">
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        Blogy
      </h1>
      <div className="header-actions">
        {state.isAuthenticated && (
          <button onClick={handleNewPost}>New Post</button>
        )}
        <button onClick={handleAuth} className="secondary">
          {state.isAuthenticated ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

export default Header;

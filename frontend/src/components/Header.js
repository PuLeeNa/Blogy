import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

function Header() {
  const navigate = useNavigate();
  const { state, signIn, signOut } = useAuthContext();

  const handleAuth = () => {
    state.isAuthenticated ? signOut() : signIn();
  };

  return (
    <div className="header">
      <h1 onClick={() => navigate("/")}>Blogy</h1>
      <div className="header-actions">
        {state.isAuthenticated && (
          <button onClick={() => navigate("/create")}>New Post</button>
        )}
        <button onClick={handleAuth} className="secondary">
          {state.isAuthenticated ? "Sign Out" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

export default Header;

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "@asgardeo/auth-react";

const config = {
  clientID: window.configs?.clientID,
  baseUrl: window.configs?.baseUrl,
  signInRedirectURL: window.configs?.signInRedirectURL,
  signOutRedirectURL: window.configs?.signOutRedirectURL,
  scope: ["openid", "profile"],
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider config={config}>
    <App />
  </AuthProvider>,
);

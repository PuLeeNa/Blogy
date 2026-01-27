import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "@asgardeo/auth-react";

const config = {
  clientID: process.env.REACT_APP_ASGARDEO_CLIENT_ID,
  baseUrl: process.env.REACT_APP_ASGARDEO_BASE_URL,
  signInRedirectURL: process.env.REACT_APP_ASGARDEO_SIGN_IN_REDIRECT_URL,
  signOutRedirectURL: process.env.REACT_APP_ASGARDEO_SIGN_OUT_REDIRECT_URL,
  scope: ["openid", "profile", "email"],
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

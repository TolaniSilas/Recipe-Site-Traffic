import React from "react";
import ReactDOM from "react-dom/client"; // Use the new ReactDOM client
import App from "./App";
import "./index.css"; // If you have any global styles
import "bootstrap/dist/css/bootstrap.min.css";

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

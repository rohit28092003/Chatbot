import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chatbot from "./Chatbot";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    // Check for token on mount
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }

    // Listen for token changes (useful if another tab logs out)
    const handleStorageChange = () => {
      setToken(localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
   
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
      </Routes>
 
  );
};

export default App;

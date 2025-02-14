import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"
import Signup from "./components/Signup"
import Chatbot from "./Chatbot";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
  
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={token ? <Chatbot token={token} /> : <Login setToken={setToken} />} />
      </Routes>
  
  );
};

export default App;

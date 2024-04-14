import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset/:token" element={<NewPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset/:token" element={<NewPassword />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

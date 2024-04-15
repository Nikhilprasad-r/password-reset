import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import img from "../assets/home.jpg";
const Home = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div style={{ backgroundImage: `url(${img})` }}>
      <div className="container">
        <h1 className="text-center">Welcome to the Home Page</h1>
      </div>
    </div>
  );
};

export default Home;

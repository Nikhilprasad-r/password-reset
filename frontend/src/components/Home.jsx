import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <Link to="/signup">Sign Up</Link> |
      <Link to="/reset-password">Reset Password</Link>
    </div>
  );
};

export default Home;

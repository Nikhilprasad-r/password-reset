import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navbarStyle = {
    backgroundColor: isAuthenticated ? "green" : "yellow",
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white`}>
      <a className="navbar-brand" href="/">
        Navbar
      </a>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <Link className="nav-item nav-link active" to="/">
            Home
          </Link>
          <Link className="nav-item nav-link" to="/signup">
            Sign Up
          </Link>
          <Link className="nav-item nav-link" to="/reset-password">
            Reset Password
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

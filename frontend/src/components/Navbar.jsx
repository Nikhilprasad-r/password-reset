import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navbarStyle = {
    backgroundColor: isAuthenticated ? "green" : "yellow",
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-white d-flex justify-content-center `}
    >
      <div className="navbar-nav">
        <Link className="nav-item nav-link active" to="/">
          Url shortner
        </Link>
        <Link className="nav-item nav-link" to="/signup">
          Sign Up
        </Link>
        <Link className="nav-item nav-link" to="/reset-password">
          Reset Password
        </Link>
        <button onClick={signOut} className="btn btn-danger">
          Signout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

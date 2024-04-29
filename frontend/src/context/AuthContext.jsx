import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  signIn: () => {},
  signOut: () => {},
  apiUrl: "",
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [user, setUser] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const signIn = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const signOut = () => {
    ocalStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/auth/validatetoken`, {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        method: "GET",
      });
      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
      if (!isValid) {
        localStorage.removeItem("token", "user");
      }
    } else {
      setIsAuthenticated(false);
    }
    if (token) {
      validateToken(token).then((isValid) => {
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem("token");
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Sync logout across tabs
  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && !event.newValue) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, signIn, user, signOut, apiUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

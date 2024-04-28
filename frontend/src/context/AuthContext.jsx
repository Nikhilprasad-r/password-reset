import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
  apiUrl: "",
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const apiUrl = import.meta.env.VITE_API_URL;

  const signIn = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/validateToken`, {
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
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, apiUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

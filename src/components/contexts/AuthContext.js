import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getCurrentUser,
  loginUser,
  createUser,
  logoutUser,
} from "../utils/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const signup = async (
    email,
    password,
    name,
    userType,
    cafeName,
    cafeLocation
  ) => {
    try {
      const user = createUser(
        email,
        password,
        name,
        userType,
        cafeName,
        cafeLocation
      );
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const user = loginUser(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
